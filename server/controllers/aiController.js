import Groq from 'groq-sdk';
import Product from '../models/Product.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import dotenv from 'dotenv';
dotenv.config();

const groq = process.env.GROQ_API_KEY ? new Groq({
  apiKey: process.env.GROQ_API_KEY,
}) : null;

/**
 * @desc    Chat with AI Shopping Assistant
 * @route   POST /api/ai/chat
 * @access  Public
 */
export const chatWithAI = asyncHandler(async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    throw new AppError('Message is required', 400);
  }

  // Define the system prompt for the AI Assistant
  const systemPrompt = `You are Nex, the AI Shopping Assistant for NexMart, a premium eCommerce platform. 
  Your job is to help users find products, answer questions about policies (free shipping over ₹499, 30-day returns), and be helpful and polite.
  
  When a user asks for product recommendations, you MUST output a JSON block inside <search_params> tags. This JSON block will be parsed by the backend to search the database. 
  Do not invent products; instead, ask the system to search for them.
  
  Example 1:
  User: "I'm looking for a cheap laptop."
  Nex: "I can help with that! Let me check our inventory for laptops under your budget."
  <search_params>
  {
    "category": "electronics",
    "keyword": "laptop",
    "maxPrice": 50000
  }
  </search_params>
  
  Example 2:
  User: "Do you have any red running shoes?"
  Nex: "Sure, let me find some red running shoes for you."
  <search_params>
  {
    "keyword": "running shoes red"
  }
  </search_params>

  Valid JSON keys for <search_params> are: keyword (string), category (string), minPrice (number), maxPrice (number).
  Respond in a friendly, conversational tone. If they just say "hello", greet them and ask how you can help. Do not output <search_params> unless they are explicitly looking for a product.`;

  // Fallback if no API key is provided in development
  if (!groq) {
    console.warn('GROQ_API_KEY is not set. Using mock AI response.');
    
    // Simple mock keyword extraction
    const lowercaseMsg = message.toLowerCase();
    let keyword = '';
    if (lowercaseMsg.includes('laptop')) keyword = 'laptop';
    if (lowercaseMsg.includes('phone') || lowercaseMsg.includes('mobile')) keyword = 'phone';
    if (lowercaseMsg.includes('shoe')) keyword = 'shoe';

    let products = [];
    if (keyword) {
      products = await Product.find({
        $text: { $search: keyword }
      }).limit(3).select('name slug price variants images');
    }

    return res.status(200).json({
      success: true,
      reply: `[Mock Mode] Hello! I noticed you are looking for ${keyword || 'something'}. Here is what I found in our catalog!`,
      products,
    });
  }

  // Construct message array for Groq
  const messages = [
    { role: 'system', content: systemPrompt },
    ...(history || []),
    { role: 'user', content: message }
  ];

  try {
    const aiResponse = await groq.chat.completions.create({
      model: 'llama3-70b-8192',
      max_tokens: 500,
      messages: messages,
    });

    const aiText = aiResponse.choices[0].message.content;
    
    let products = [];
    let cleanReply = aiText;

    // Check if Claude requested a search
    const searchMatch = aiText.match(/<search_params>([\s\S]*?)<\/search_params>/);
    
    if (searchMatch && searchMatch[1]) {
      try {
        const searchParams = JSON.parse(searchMatch[1].trim());
        cleanReply = aiText.replace(/<search_params>[\s\S]*?<\/search_params>/, '').trim();

        // Build MongoDB Query
        const query = {};
        
        if (searchParams.keyword) {
          query.$text = { $search: searchParams.keyword };
        }
        if (searchParams.category) {
          query.category = { $regex: new RegExp(`^${searchParams.category}$`, 'i') };
        }
        
        // Handle Price filters based on variant prices
        if (searchParams.minPrice || searchParams.maxPrice) {
          query['variants.price'] = {};
          if (searchParams.minPrice) query['variants.price'].$gte = searchParams.minPrice;
          if (searchParams.maxPrice) query['variants.price'].$lte = searchParams.maxPrice;
        }

        // Execute search
        products = await Product.find(query).limit(4).select('name slug category variants');
        
        if (products.length === 0) {
          // If no products found, we could do a secondary broader search, but for simplicity:
          cleanReply += "\n\nI couldn't find any exact matches for that in our current inventory. Can I help you look for something else?";
        }
      } catch (jsonErr) {
        console.error('Failed to parse Claude search params:', jsonErr);
      }
    }

    res.status(200).json({
      success: true,
      reply: cleanReply,
      products,
    });
  } catch (error) {
    console.error('Claude API Error:', error);
    throw new AppError('AI service is currently unavailable. Please try again later.', 503);
  }
});
