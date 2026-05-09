import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    verifiedPurchase: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const variantSchema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true },
  color: { type: String }, // e.g., 'Space Gray'
  colorCode: { type: String }, // e.g., '#4A4A4A'
  size: { type: String }, // e.g., '256GB' or 'XL'
  price: { type: Number, required: true },
  compareAtPrice: { type: Number },
  stock: { type: Number, required: true, min: 0 },
  images: [
    {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
  ],
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [120, 'Product name cannot exceed 120 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    brand: {
      type: String,
      required: [true, 'Product brand is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      enum: ['electronics', 'fashion', 'home', 'sports', 'books', 'beauty'],
    },
    subcategory: {
      type: String,
      trim: true,
    },
    variants: [variantSchema],
    features: [String],
    specs: {
      type: Map,
      of: String, // Dynamic key-value pairs for specifications
    },
    ratings: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    reviews: [reviewSchema],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    tags: [String],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for high-performance searching and filtering
productSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' });
productSchema.index({ category: 1, 'variants.price': 1 });

// Virtual to get the lowest price from variants
productSchema.virtual('startingPrice').get(function () {
  if (!this.variants || this.variants.length === 0) return 0;
  return Math.min(...this.variants.map((v) => v.price));
});

// Virtual to calculate total stock
productSchema.virtual('totalStock').get(function () {
  if (!this.variants || this.variants.length === 0) return 0;
  return this.variants.reduce((total, v) => total + v.stock, 0);
});

// Middleware to auto-generate slug if not provided
productSchema.pre('validate', function () {
  if (this.name && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
});

const Product = mongoose.model('Product', productSchema);

export default Product;
