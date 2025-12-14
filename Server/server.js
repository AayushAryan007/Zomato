require("dotenv").config(); // Load env first
// In server.js if you require("./src/app") before calling require("dotenv").config() that loads routes/controllers/services, which initialize ImageKit while process.env.* is still undefined. Hence “Missing publicKey”.
const app = require("./src/app");
const connectDB = require("./src/db/db");

connectDB();

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
