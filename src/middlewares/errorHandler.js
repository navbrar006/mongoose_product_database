const { formatMongooseError } = require("../modules/products/product.controller");

module.exports = (err, req, res, next) => {
  // Mongoose validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation failed",
      details: formatMongooseError(err),
    });
  }

  // Duplicate key error (if you ever add unique fields later)
  if (err.code === 11000) {
    return res.status(400).json({
      message: "Duplicate key error",
      details: ["Duplicate value found"],
    });
  }

  console.error(err);

  return res.status(500).json({
    message: "Server error",
  });
};