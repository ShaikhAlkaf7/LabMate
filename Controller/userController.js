const User = require("../Models/userSchema.js");

const createUserController = async (req, res) => {
  try {
    const { name, email, phone } = req?.body;

    if (!name || !email || !phone)
      return res.status(400).send({
        message: "All filds are Required",
        success: false,
      });

    // checking the user already exists or not
    const checkingUser = await User.findOne({ email });
    if (checkingUser)
      return res
        .status(400)
        .send({ success: false, message: "user Already exists" });

    const user = await User.create({ name, email, phone });

    if (!user)
      return res.status(400).send({
        success: false,
        message: "user creation failed",
      });

    // if user created successfully
    res.status(200).send({
      success: true,
      message: "user created successfully",
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: "Somthing went wrong creating user",
      error,
    });
  }
};

const searchUserController = async (req, res) => {
  try {
    const { name } = req?.query;

    const users = await User.find({ name: { $regex: name, $options: "i" } });

    if (!users || users?.length < 1)
      return res.status(404).send({
        success: false,
        message: "users not found",
      });

    res.status(200).send({
      success: true,
      message: "user found successfully",
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      message: "something went wrong while finding users",
      error,
    });
  }
};

module.exports = { createUserController, searchUserController };
