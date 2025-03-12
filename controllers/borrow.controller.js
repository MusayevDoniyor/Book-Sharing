const Book = require("../models/book.model");
const BorrowRequest = require("../models/borrow.model");

const requestBorrow = async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findById(bookId);

    if (!book) return res.status(404).json({ message: "Kitob topilmadi!" });
    if (book.owner.toString() === req.user.id)
      return res
        .status(400)
        .json({ message: "O'zingizning kitobingizni ololmaysiz!" });
    if (book.status === "Band")
      return res.status(400).json({ message: "Kitob band qilingan!" });

    const borrowRequest = new BorrowRequest({
      book: bookId,
      borrower: req.user.id,
      owner: book.owner,
      status: "Olingan",
    });

    await borrowRequest.save();
    res.status(201).json({
      message: "Ijaraga olish so'rovi yuborildi!",
      request: borrowRequest,
    });
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};

const respondToRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    const request = await BorrowRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: "So'rov topilmadi!" });

    const book = await Book.findById(request.book);
    if (!book) return res.status(404).json({ message: "Kitob topilmadi!" });

    if (book.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Faqat o'z kitobingiz uchun so'rovlarga javob bera olasiz!",
      });
    }

    request.status = status;
    await request.save();

    if (status === "Accepted") {
      book.status = "Band";
      await book.save();
    }

    res.json({ message: `So'rov ${status} qilindi!`, request });
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};

const returnBook = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await BorrowRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: "So'rov topilmadi!" });

    if (request.borrower.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Faqat olgan kitobingizni qaytara olasiz!" });
    }

    if (request.status !== "Olingan") {
      return res
        .status(400)
        .json({ message: "Bu kitob qaytarishga mos emas!" });
    }

    request.status = "Qaytarilgan";
    await request.save();

    const book = await Book.findById(request.book);
    book.status = "Mavjud";
    await book.save();

    res.json({ message: "Kitob qaytarildi!", request });
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};

module.exports = { requestBorrow, respondToRequest, returnBook };
