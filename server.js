require("dotenv").config();
const connectDB = require("./config/db");
const { app, server } = require("./middlewares/app");

connectDB();

const PORT = process.env.PORT || 7700;

server.listen(PORT, () => {
  console.log(
    `🚀 Server (REST + WebSocket) is running on http://localhost:${PORT}`
  );
});
