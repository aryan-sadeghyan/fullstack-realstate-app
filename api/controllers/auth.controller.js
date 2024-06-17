import prisma from "../../prisma/prismaClient.js";
import bcrypt, { hashSync } from "bcrypt";
import { errorHandeler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !password || !email) {
    return res.send({
      success: false,
      message: "input fields are empty",
    });
  }
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const info = await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });
    res.send({
      success: true,
      message: "user created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { password, email } = req.body;

  try {
    const validUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!validUser) {
      return next(errorHandeler(404, "user not found"));
    }
    const validPassword = await bcrypt.compare(password, validUser.password);
    if (!validPassword) {
      return next(errorHandeler(401, "wrong username or password"));
    }

    const token = jwt.sign({ id: validUser.id }, process.env.JWT_SECRET);
    res.cookie("access_token", token, { httpOnly: true });
    delete validUser.password;
    res.send({
      success: true,
      user: validUser,
      token,
    });
  } catch (error) {
    next(error);
  }
};
