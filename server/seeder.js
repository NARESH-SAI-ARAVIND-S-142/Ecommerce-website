import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/nexmart')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const products = [
  {
    name: 'Quantum X Pro Smartphone',
    slug: 'quantum-x-pro',
    description: 'The next generation of mobile computing with an AI-powered neural engine, 120Hz OLED display, and a professional-grade camera system.',
    brand: 'Quantum',
    category: 'electronics',
    isFeatured: true,
    ratings: { average: 4.8, count: 124 },
    variants: [
      {
        sku: 'QX-256-BLK',
        color: 'Midnight Black',
        price: 89999,
        compareAtPrice: 99999,
        stock: 50,
        images: [
          { url: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=80', publicId: 'qxp_1' },
          { url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80', publicId: 'qxp_2' }
        ]
      }
    ],
    features: ['120Hz Super AMOLED Display', 'A15 Bionic Chip', 'Triple Camera Setup', '5G Ready']
  },
  {
    name: 'AeroNoise Cancelling Headphones',
    slug: 'aero-noise-cancelling',
    description: 'Immersive sound experience with active noise cancellation and 40-hour battery life.',
    brand: 'AeroAudio',
    category: 'electronics',
    isFeatured: true,
    ratings: { average: 4.6, count: 89 },
    variants: [
      {
        sku: 'ANC-WHT',
        color: 'Cloud White',
        price: 24999,
        compareAtPrice: 29999,
        stock: 120,
        images: [
          { url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80', publicId: 'anc_1' },
          { url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80', publicId: 'anc_2' }
        ]
      }
    ]
  },
  {
    name: 'Minimalist Leather Backpack',
    slug: 'minimalist-leather-backpack',
    description: 'Handcrafted premium leather backpack perfect for daily commute and weekend getaways. Features a padded laptop sleeve.',
    brand: 'UrbanCraft',
    category: 'fashion',
    isFeatured: true,
    ratings: { average: 4.9, count: 56 },
    variants: [
      {
        sku: 'UC-BP-BRN',
        color: 'Cognac Brown',
        price: 8499,
        stock: 30,
        images: [
          { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80', publicId: 'bp_1' }
        ]
      }
    ]
  },
  {
    name: 'Smart Fitness Watch Series 5',
    slug: 'smart-fitness-watch-5',
    description: 'Track your health, workouts, and sleep with precision. Built-in GPS and heart-rate monitoring.',
    brand: 'FitTech',
    category: 'electronics',
    ratings: { average: 4.5, count: 210 },
    variants: [
      {
        sku: 'FW5-BLK',
        color: 'Graphite',
        price: 14999,
        compareAtPrice: 19999,
        stock: 85,
        images: [
          { url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80', publicId: 'fw_1' }
        ]
      }
    ]
  },
  {
    name: 'Organic Cotton T-Shirt',
    slug: 'organic-cotton-tshirt',
    description: 'Ultra-soft, breathable, and sustainably sourced organic cotton t-shirt.',
    brand: 'EcoWear',
    category: 'fashion',
    ratings: { average: 4.3, count: 42 },
    variants: [
      {
        sku: 'ECO-TS-WHT-L',
        size: 'L',
        color: 'White',
        price: 999,
        stock: 200,
        images: [
          { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80', publicId: 'ts_1' }
        ]
      }
    ]
  },
  {
    name: 'Ceramic Pour-Over Coffee Maker',
    slug: 'ceramic-pourover',
    description: 'Artisan ceramic pour-over cone for the perfect cup of handcrafted coffee.',
    brand: 'BrewMaster',
    category: 'home',
    isFeatured: true,
    ratings: { average: 4.7, count: 18 },
    variants: [
      {
        sku: 'BM-CM-WHT',
        color: 'Matte White',
        price: 2499,
        compareAtPrice: 3000,
        stock: 15,
        images: [
          { url: 'https://images.unsplash.com/photo-1544243644-84512c19e599?w=800&q=80', publicId: 'cm_1' }
        ]
      }
    ]
  }
];

const seedDB = async () => {
  try {
    await Product.deleteMany();
    console.log('Products cleared');
    await Product.insertMany(products);
    console.log('Dummy products seeded successfully');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedDB();
