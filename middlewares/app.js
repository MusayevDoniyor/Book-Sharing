const express = require("express");
const app = express();
const cors = require("cors");
const authRoutes = require("../routes/auth.routes");
const bookRoutes = require("../routes/book.routes");
const borrowRoutes = require("../routes/borrow.routes");

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Book Sharing Platform API ishlayapti!");
});

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/borrow", borrowRoutes);

module.exports = app;
