const io = require("socket.io-client");

const socket = io("ws://localhost:5500", {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("✅ WebSocket bog'landi!", socket.id);

  // Test uchun serverga xabar yuboramiz
  socket.emit("newMessage", { user: "Doniyor", message: "Salom!" });
});

socket.on("receiveMessage", (data) => {
  console.log("📩 Yangi xabar: ", data);
});

socket.on("disconnect", () => {
  console.log("❌ WebSocket uzildi!");
});
