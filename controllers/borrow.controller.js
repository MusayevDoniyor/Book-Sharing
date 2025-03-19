const Book = require("../models/book.model");
const BorrowRequest = require("../models/borrow.model");
const response = require("../handlers/response");
const findDocumentById = require("../handlers/findDocument");

const requestBorrow = async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await findDocumentById(Book, bookId, res, "Kitob topilmadi!");
    if (!book) return;

    if (book.owner.toString() === req.user.id)
      return response(res, 400, "O'zingizning kitobingizni ololmaysiz!");

    if (book.status === "Band")
      return response(res, 400, "Kitob band qilingan!");

    const borrowRequest = new BorrowRequest({
      book: bookId,
      borrower: req.user.id,
      owner: book.owner,
      status: "Olingan",
    });

    await borrowRequest.save();
    response(res, 201, null, {
      message: "Ijaraga olish so'rovi yuborildi!",
      request: borrowRequest,
    });
  } catch (error) {
    response(res, 500, error);
  }
};

const respondToRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    const request = await findDocumentById(
      BorrowRequest,
      requestId,
      res,
      "So'rov topilmadi!"
    );
    if (!request) return;

    const book = await findDocumentById(
      Book,
      request.book,
      res,
      "Kitob topilmadi!"
    );
    if (!book) return;

    if (book.owner.toString() !== req.user.id)
      return response(
        res,
        403,
        "Faqat o'z kitobingiz uchun so'rovlarga javob bera olasiz!"
      );

    request.status = status;
    await request.save();

    if (status === "Accepted") {
      book.status = "Band";
      await book.save();
    }

    response(res, 200, null, { message: `So'rov ${status} qilindi!`, request });
  } catch (error) {
    response(res, 500, error);
  }
};

const returnBook = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await findDocumentById(
      BorrowRequest,
      requestId,
      res,
      "So'rov topilmadi!"
    );
    if (!request) return;

    if (request.borrower.toString() !== req.user.id)
      return response(res, 403, "Faqat olgan kitobingizni qaytara olasiz!");

    if (request.status !== "Olingan")
      return response(res, 400, "Bu kitob qaytarishga mos emas!");

    request.status = "Qaytarilgan";
    await request.save();

    const book = await findDocumentById(
      Book,
      request.book,
      res,
      "Kitob topilmadi!"
    );
    if (!book) return;

    book.status = "Mavjud";
    await book.save();

    response(res, 200, null, { message: "Kitob qaytarildi!", request });
  } catch (error) {
    response(res, 500, error);
  }
};

const getMyBorrows = async (req, res) => {
  try {
    const userId = req.user.id;

    const borrows = await BorrowRequest.find({ borrower: userId }).populate(
      "book"
    );

    response(res, 200, null, { count: borrows.length, borrows });
  } catch (error) {
    response(res, 500, error);
  }
};

module.exports = { requestBorrow, respondToRequest, returnBook, getMyBorrows };
