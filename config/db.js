const { default: mongoose } = require("mongoose");

const connection_string = process.env.CONNECTION_STRING;

const connectDB = async () => {
  const connect = mongoose
    .connect(connection_string)
    .then(() => {
      console.log("✅ MongoDB connected successfully");
    })
    .catch((err) => {
      console.log("❌ MongoDB not connected", err.message);
    });

  return connect;
};

module.exports = connectDB;
