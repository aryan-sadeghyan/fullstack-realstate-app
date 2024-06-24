import jwt from "jsonwebtoken";
import prisma from "../../prisma/prismaClient.js";
import { errorHandeler } from "../utils/error.js";
import bcrypt from "bcrypt";
export const getUserFromToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ success: false, message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];
    const userId = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: {
        id: userId.id,
      },
    });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    delete user.password;
    res.send({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error fetching user from token:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandeler(401, "not allowd to updated information"));
  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }
    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        avatar: req.body.avatar,
      },
    });
    delete updatedUser.password;
    res.send({ success: true, updatedUser });
  } catch (error) {
    next(error);
  }
};
