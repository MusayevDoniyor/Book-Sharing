const findDocumentById = require("../handlers/findDocument");
const response = require("../handlers/response");
const Book = require("../models/book.model");

const addBook = async (req, res) => {
  try {
    console.log(req.user.id);
    let { title, author, genres, description } = req.body;
    const coverImage = req.file ? `/uploads/${req.file.filename}` : null;

    if (typeof genres === "string") {
      genres = genres.split(",").map((g) => g.trim());
    }

    const newBook = new Book({
      title,
      author,
      genres,
      description,
      coverImage,
      owner: req.user.id,
    });

    await newBook.save();
    return response(res, 201, null, { book: newBook });
  } catch (error) {
    return response(res, 500, error.message);
  }
};

const getAllBooks = async (req, res) => {
  try {
    const { genre, author } = req.query;
    let query = {};

    if (genre) query.genres = { $in: [genre] };
    if (author) query.author = new RegExp(author, "i");

    let books = await Book.find(query).populate("owner", "name email");

    if (books.length === 0) {
      books = await Book.find().populate("owner", "name email");
    }

    return response(res, 200, null, { count: books.length, books });
  } catch (error) {
    return response(res, 500, error.message);
  }
};

const getBookById = async (req, res) => {
  try {
    const book = await findDocumentById(
      Book,
      req.params.id,
      res,
      "Kitob topilmadi"
    );

    if (!book) return;

    await book.populate("owner", "name email");

    return response(res, 200, null, book);
  } catch (error) {
    return response(res, 500, error.message);
  }
};

const updateBook = async (req, res) => {
  try {
    const { title, author, genres, description, status } = req.body;
    const coverImage = req.file ? `/uploads/${req.file.filename}` : null;

    const book = await findDocumentById(
      Book,
      req.params.id,
      res,
      "Kitob topilmadi"
    );

    if (!book) return;

    if (book.owner.toString() !== req.user.id) {
      return response(
        res,
        403,
        "Siz faqat o'z kitobingizni yangilashingiz mumkin!"
      );
    }

    if (genres) {
      book.genres = Array.isArray(genres) ? genres : [genres];
    }

    book.title = title ?? book.title;
    book.author = author ?? book.author;
    book.description = description ?? book.description;
    book.status = status ?? book.status;
    book.coverImage = coverImage ?? book.coverImage;

    await book.save();
    return response(res, 200, null, { message: "Kitob yangilandi!", book });
  } catch (error) {
    return response(res, 500, error.message);
  }
};

const deleteBook = async (req, res) => {
  try {
    const book = await findDocumentById(
      Book,
      req.params.id,
      res,
      "Kitob topilmadi"
    );

    if (!book) return;

    if (book.owner.toString() !== req.user.id) {
      return response(res, 403, "Siz faqat o'z kitobingizni o'chira olasiz!");
    }

    await book.deleteOne();
    return response(res, 200, null, { message: "Kitob o'chirildi!" });
  } catch (error) {
    return response(res, 500, error.message);
  }
};

module.exports = {
  addBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
};
