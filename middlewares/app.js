const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const authRoutes = require("../routes/auth.routes");
const bookRoutes = require("../routes/book.routes");
const borrowRoutes = require("../routes/borrow.routes");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Agar front-end specific domain bo‘lsa, uni kiriting
    methods: ["GET", "POST"], // Ruxsat berilgan metodlar
    allowedHeaders: ["Content-Type"], // Ruxsat berilgan headerlar
    credentials: true, // Agar kerak bo‘lsa, cookie va auth ma’lumotlarini qo‘shish
  },
});

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("newMessage", (data) => {
    console.log("Yangi xabar:", data);
    io.emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Book Sharing Platform API ishlayapti!");
});

app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/borrow", borrowRoutes);

module.exports = { app, server };
