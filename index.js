const app = require("./src/app");
require("dotenv").config();
const connectDB = require("./src/config/db");

// connect DB
connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});