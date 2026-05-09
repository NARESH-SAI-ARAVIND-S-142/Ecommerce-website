import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineSparkles, HiOutlineX, HiOutlinePaperAirplane } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi there! I am Nex, your AI shopping assistant. What can I help you find today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Send history excluding the last initial greeting and excluding product payload objects
      const history = messages
        .filter((m) => !m.products) // Don't send product arrays back to Claude
        .map((m) => ({ role: m.role, content: m.content }));

      const { data } = await api.post('/ai/chat', { message: userMessage.content, history });

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply, products: data.products }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I am having trouble connecting to my brain right now. Please try again later!' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-tr from-violet to-cyan rounded-full shadow-[0_0_20px_rgba(108,71,255,0.4)] flex items-center justify-center text-white z-50 cursor-pointer"
          >
            <HiOutlineSparkles size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] max-h-[80vh] glass-strong rounded-2xl border border-white/10 shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center backdrop-blur-md">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet to-cyan flex items-center justify-center">
                  <HiOutlineSparkles className="text-white" size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Nex Assistant</h3>
                  <span className="text-[10px] text-cyan flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" /> Online
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <HiOutlineX size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-[85%]">
                    {/* Text Bubble */}
                    <div
                      className={`p-3 rounded-2xl text-sm ${
                        msg.role === 'user'
                          ? 'bg-violet text-white rounded-tr-sm'
                          : 'bg-white/10 text-gray-200 border border-white/5 rounded-tl-sm'
                      }`}
                    >
                      {msg.content}
                    </div>

                    {/* Product Recommendations */}
                    {msg.products && msg.products.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {msg.products.map((p) => (
                          <Link
                            key={p._id}
                            to={`/product/${p.slug}`}
                            className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-violet/50 transition-all group"
                          >
                            <img
                              src={p.variants?.[0]?.images?.[0]?.url || 'https://via.placeholder.com/150'}
                              alt={p.name}
                              className="w-10 h-10 rounded-lg object-cover bg-white/5"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-white line-clamp-1 group-hover:text-violet transition-colors">
                                {p.name}
                              </p>
                              <p className="text-xs text-cyan">₹{(p.variants?.[0]?.price || 0).toLocaleString()}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 border border-white/5 rounded-2xl rounded-tl-sm p-4 flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-navy/80 border-t border-white/10 backdrop-blur-md">
              <form onSubmit={handleSend} className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Ask me anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-violet focus:ring-1 focus:ring-violet transition-colors"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="absolute right-2 p-1.5 text-gray-400 hover:text-cyan disabled:opacity-50 transition-colors"
                >
                  <HiOutlinePaperAirplane className="rotate-90" size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
