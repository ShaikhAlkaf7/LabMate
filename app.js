const express = require("express");
const dotenv = require("dotenv");
const userRouter = require("./router/userRouter.js");
const bookRouter = require("./router/booksRoute.js");
const statsRoute = require("./router/statsRoute.js");
const mongoose = require("mongoose");
const cors = require("cors");

dotenv.config();

const app = express();

app.use(cors({ origin: "https://lab-mate.vercel.app" }));

app.use(express.json());

const port = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send({ mesage: "connected" });
});

// routes
app.use("/api/user", userRouter);
app.use("/api/book", bookRouter);
app.use("/api/stats", statsRoute);

const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then((e) => console.log(e.connection.host))
    .catch((error) => console.log(error));
};

app.listen(port, () => {
  connectDB();
  console.log(`server is started on ${port} `);
});
