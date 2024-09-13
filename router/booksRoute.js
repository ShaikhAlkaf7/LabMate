const express = require("express");
const {
  createBooksController,
  searchBookController,
  issuRentBookController,
  returnBookController,
} = require("../Controller/booksController");

const router = express.Router();

router.post("/create-book", createBooksController);

router.get("/search", searchBookController);

router.post("/issue-rent-book", issuRentBookController);

router.post("/retun-book", returnBookController);
module.exports = router;
