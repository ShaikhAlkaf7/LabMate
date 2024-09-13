const Book = require("../Models/bookSchema");
const Transaction = require("../Models/transactionSchema");

const createBooksController = async (req, res) => {
  try {
    const { name, category, rentPerDay } = req?.body;

    if (!name || !category || !rentPerDay)
      return res.status(400).send({
        success: false,
        message: "All Fileds are required",
      });

    const book = await Book.create({ name, category, rentPerDay });

    if (!book)
      return res.status(400).send({
        success: false,
        message: "book listing failed",
      });

    res.status(200).send({
      success: false,
      message: "book listing successfully",
      book,
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: "something went wrong while creating the book",
      error,
    });
  }
};

const searchBookController = async (req, res) => {
  try {
    const { name, price, category } = req?.query;
    let query = {};

    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    if (price) {
      query.rentPerDay = { $lte: price };
    }

    if (category) {
      query.category = category;
    }

    const books = await Book.find(query);

    if (!books)
      return res.status(404).send({
        success: false,
        message: "books for your query not found",
      });

    console.log(books);

    res.status(200).send({
      success: true,
      message: "books found sucessfully",
      books,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      message: "something went wrong while searching book",
      error,
    });
  }
};

const issuRentBookController = async (req, res) => {
  try {
    const { book, user, issueDate } = req?.body;

    if (!book || !user || !issueDate)
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      });

    const transaction = await Transaction.create({
      book,
      user,
      issueDate,
    });

    if (!transaction)
      return res.status(404).send({
        success: false,
        message: "book issue failed",
      });

    res.status(200).send({
      success: true,
      message: "book issued successfuly",
      transaction,
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: "somthing went wrong while issu the book",
      error,
    });
  }
};

// calculate rent and return boo\k
const returnBookController = async (req, res) => {
  try {
    const { book, user, returnDate } = req?.body;

    if (!book || !user || !returnDate)
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      });

    const transaction = await Transaction.findOne({
      book,
      user,
    }).populate("book");

    if (!transaction)
      return res.status(404).send({
        success: false,
        message: "transaction not found",
      });

    const issueDate = new Date(transaction?.issueDate);
    const returnDateObj = new Date(returnDate);
    const diffTime = Math.abs(returnDateObj - issueDate);

    const rentDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const rent = rentDays * transaction?.book?.rentPerDay;

    transaction.returnDate = returnDate;
    transaction.rent = rent;
    await transaction.save();

    res.status(200).send({
      success: true,
      message: "book retund successfuly",
      transaction,
      rent,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      message: "somthing went wrong while return the book",
      error,
    });
  }
};

module.exports = {
  createBooksController,
  searchBookController,
  issuRentBookController,
  returnBookController,
};
