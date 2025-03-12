const { default: mongoose } = require("mongoose");

const BorrowSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    borrower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    borrowDate: {
      type: Date,
      default: Date.now(),
    },
    returnDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "Accepted",
        "Rejected",
        "Olingan",
        "Qaytarilgan",
        "Muddati o'tgan",
      ],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Borrow", BorrowSchema);
