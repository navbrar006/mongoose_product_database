const app = require("../src/app");

// Vercel Serverless Function expects (req, res)
module.exports = (req, res) => app(req, res);