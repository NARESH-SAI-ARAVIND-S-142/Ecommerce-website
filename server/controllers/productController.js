import Product from '../models/Product.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';

/**
 * @desc    Get all products with filtering, sorting, and pagination
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = asyncHandler(async (req, res) => {
  const { keyword, category, brand, minPrice, maxPrice, sort, page, limit } = req.query;

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 12;
  const startIndex = (pageNum - 1) * limitNum;

  // Build query
  const query = { isActive: true };

  // Text search
  if (keyword) {
    query.$text = { $search: keyword };
  }

  // Exact matches
  if (category) query.category = category;
  if (brand) query.brand = brand;

  // Price range (filtering on the minimum price among variants)
  if (minPrice || maxPrice) {
    query['variants.price'] = {};
    if (minPrice) query['variants.price'].$gte = Number(minPrice);
    if (maxPrice) query['variants.price'].$lte = Number(maxPrice);
  }

  let dbQuery = Product.find(query);

  // Sorting
  if (sort) {
    const sortBy = sort.split(',').join(' ');
    // Handle price sorting specially since it's inside variants array
    // Mongoose doesn't perfectly sort array of objects by field value in simple find queries
    // Usually, you aggregate or sort by the virtual `startingPrice` if possible, but virtuals can't be sorted in DB.
    // For now, we'll sort by 'variants.price' which sorts by the lowest price in the array (MongoDB feature)
    if (sortBy === 'price') dbQuery = dbQuery.sort('variants.price');
    else if (sortBy === '-price') dbQuery = dbQuery.sort('-variants.price');
    else dbQuery = dbQuery.sort(sortBy);
  } else if (keyword) {
    // Sort by text score if searching
    dbQuery = dbQuery.sort({ score: { $meta: 'textScore' } });
  } else {
    // Default sort by newest
    dbQuery = dbQuery.sort('-createdAt');
  }

  // Select fields to optimize payload
  dbQuery = dbQuery.select('name slug brand category variants ratings isFeatured');

  // Execute query with pagination
  dbQuery = dbQuery.skip(startIndex).limit(limitNum);

  const [products, total] = await Promise.all([
    dbQuery.exec(),
    Product.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    count: products.length,
    total,
    totalPages: Math.ceil(total / limitNum),
    currentPage: pageNum,
    products,
  });
});

/**
 * @desc    Get single product by ID or Slug
 * @route   GET /api/products/:idOrSlug
 * @access  Public
 */
export const getProduct = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;

  // Check if it's a valid ObjectId
  const isObjectId = idOrSlug.match(/^[0-9a-fA-F]{24}$/);

  const query = isObjectId ? { _id: idOrSlug } : { slug: idOrSlug };
  const product = await Product.findOne(query).populate('reviews.user', 'name avatar');

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  res.status(200).json({
    success: true,
    product,
  });
});

/**
 * @desc    Get featured products
 * @route   GET /api/products/featured
 * @access  Public
 */
export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 8;
  const products = await Product.find({ isActive: true, isFeatured: true })
    .select('name slug brand category variants ratings')
    .limit(limit);

  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
});

/**
 * @desc    Get related products (same category/brand)
 * @route   GET /api/products/:id/related
 * @access  Public
 */
export const getRelatedProducts = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new AppError('Product not found', 404);

  const limit = parseInt(req.query.limit, 10) || 4;
  
  const related = await Product.find({
    _id: { $ne: product._id },
    isActive: true,
    category: product.category,
  })
    .select('name slug brand category variants ratings')
    .limit(limit);

  res.status(200).json({
    success: true,
    count: related.length,
    products: related,
  });
});

/**
 * @desc    Create a product
 * @route   POST /api/products
 * @access  Private/Admin
 */
export const createProduct = asyncHandler(async (req, res) => {
  const productData = req.body;
  
  // If images were uploaded via multer, they will be in req.files
  // We handle image uploads via a separate endpoint typically or parse them here
  
  const product = await Product.create(productData);
  
  res.status(201).json({
    success: true,
    product,
  });
});

/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) throw new AppError('Product not found', 404);

  res.status(200).json({
    success: true,
    product,
  });
});

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new AppError('Product not found', 404);

  // Soft delete by marking inactive, or hard delete. We'll do hard delete for now.
  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Product removed',
  });
});

/**
 * @desc    Upload product images
 * @route   POST /api/products/upload
 * @access  Private/Admin
 */
export const uploadImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new AppError('No images uploaded', 400);
  }

  const images = req.files.map((file) => ({
    url: file.path,
    publicId: file.filename,
  }));

  res.status(200).json({
    success: true,
    images,
  });
});
