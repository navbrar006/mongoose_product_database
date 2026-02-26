const mongoose = require("mongoose");
const Product = require("./product.model");

// helper: format mongoose validation errors nicely
const formatMongooseError = (err) => {
  if (err.name === "ValidationError") {
    return Object.values(err.errors).map((e) => e.message);
  }
  return [err.message || "Something went wrong"];
};

// ✅ CREATE: POST /api/products
const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    return res.status(201).json(product);
  } catch (err) {
    return next(err);
  }
};

// ✅ READ ALL with pagination: GET /api/products?page=1&limit=10
const getAllProducts = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limitRaw = parseInt(req.query.limit || "10", 10);
    const limit = Math.min(Math.max(limitRaw, 1), 50);

    const skip = (page - 1) * limit;

    const [total, items] = await Promise.all([
      Product.countDocuments(),
      Product.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.json({
      page,
      limit,
      total,
      totalPages,
      items,
    });
  } catch (err) {
    return next(err);
  }
};

// ✅ READ ONE: GET /api/products/:id
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(product);
  } catch (err) {
    return next(err);
  }
};

// ✅ UPDATE: PUT /api/products/:id
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const updated = await Product.findByIdAndUpdate(id, req.body, {
      new: true, // return updated doc
      runValidators: true, // apply schema validators
    });

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(updated);
  } catch (err) {
    return next(err);
  }
};

// ✅ DELETE: DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json({ message: "Product deleted" });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  formatMongooseError,
};