const Book = require("../models/book.model");

const addBook = async (req, res) => {
  try {
    console.log(req.user.id);
    let { title, author, genres, description } = req.body;

    if (!Array.isArray(genres)) genres = [genres];

    const newBook = new Book({
      title,
      author,
      genres,
      description,
      owner: req.user.id,
    });

    await newBook.save();
    res.status(201).json({ message: "Kitob qo'shildi", book: newBook });
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};

const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().populate("owner", "name email");
    res.json({ count: books.length, books });
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};

const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate(
      "owner",
      "name email"
    );
    if (!book) return res.status(404).json({ message: "Kitob topilmadi!" });

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const { title, author, genres, description, status } = req.body;

    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Kitob topilmadi!" });

    if (book.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Siz faqat o'z kitobingizni yangilashingiz mumkin!" });
    }

    if (genres) {
      book.genres = Array.isArray(genres) ? genres : [genres];
    }

    book.title = title ?? book.title;
    book.author = author ?? book.author;
    book.description = description ?? book.description;
    book.status = status ?? book.status;

    await book.save();
    res.json({ message: "Kitob yangilandi!", book });
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Kitob topilmadi!" });

    if (book.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Siz faqat o'z kitobingizni o'chira olasiz!" });
    }

    await book.deleteOne();
    res.json({ message: "Kitob o'chirildi!" });
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};

module.exports = { addBook, getAllBooks, getBookById, updateBook, deleteBook };
