const express = require("express");

const productRoutes = require("./modules/products/product.routes");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(express.json());

// Info route
app.get("/", (req, res) => {
  res.json({
    message: "Product API is running",
    endpoints: [
      "POST /api/products",
      "GET /api/products",
      "GET /api/products/:id",
      "PUT /api/products/:id",
      "DELETE /api/products/:id",
    ],
  });
});

// Product routes
app.use("/api/products", productRoutes);

// 404 + error handler (must be last)
app.use(notFound);
app.use(errorHandler);

module.exports = app;