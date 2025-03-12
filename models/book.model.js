const { default: mongoose } = require("mongoose");

const BookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    coverImage: { type: String, default: "" },
    genres: [{ type: String, required: true }],
    description: { type: String },
    status: { type: String, enum: ["Mavjud", "Band"], default: "Mavjud" },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", BookSchema);
