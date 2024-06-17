import prisma from "../../prisma/prismaClient.js";
import bcrypt from "bcrypt";
import { errorHandeler } from "../utils/error.js";

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
