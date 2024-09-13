const Transaction = require("../Models/transactionSchema.js");

const trackBookController = async (req, res) => {
  try {
    const { id } = req?.params;

    // getting transaction qty
    const transactions = await Transaction.find({ book: id }).populate("user");
    const currentlyIssued = transactions.filter((tn) => !tn.returnDate);

    // getting total rent genrated by bok
    const totalRent = transactions.reduce((sum, tn) => sum + (tn.rent || 0), 0);

    res.status(200).send({
      success: true,
      message: "book track successfully",
      transactions,
      totalIssuedCount: transactions.length,
      currentlyIssued:
        currentlyIssued.length > 0 ? currentlyIssued[0].user : "Not issued",
      totalRent,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      message: "something went wrong while tracking book",
      error,
    });
  }
};

const trackUserController = async (req, res) => {
  try {
    const { id } = req?.params;

    const transactions = await Transaction.find({ user: id }).populate("book");

    if (!transactions || transactions?.length < 0)
      return res.status(404).send({
        success: false,
        message: "issued books not found",
      });

    res.status(200).send({
      success: true,
      message: "books issued to user found successfully",
      transactions,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      message: "somthing went wrong while tracking user",
      error,
    });
  }
};

const dateRangeTrackController = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).send({
        success: false,
        message: "Please provide both startDate and endDate",
      });
    }

    const transactions = await Transaction.find({
      issueDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    }).populate("book user");

    if (!transactions.length) {
      return res.status(404).send({
        success: false,
        message: "No books issued in the given date range",
      });
    }

    const result = transactions.map((transaction) => ({
      bookName: transaction.book.name,
      userName: transaction.user.name,
      issueDate: transaction.issueDate,
    }));

    res.status(200).send({
      success: true,
      message: "Books issued in the date range fetched successfully",
      result,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      message: "somthing went wrong while tracking book between date ranges",
      error,
    });
  }
};

module.exports = {
  trackBookController,
  trackUserController,
  dateRangeTrackController,
};
