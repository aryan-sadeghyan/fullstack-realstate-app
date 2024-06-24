import prisma from "../../prisma/prismaClient.js";
import bcrypt, { hashSync } from "bcrypt";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !password || !email) {
    return res.send({
      success: false,
      message: "input fields are empty",
    });
  }
  try {
    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.cookie("access_token", token, { httpOnly: true });
    res.send({
      success: true,
      message: "user created successfully",
      token,
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
      return next(errorHandler(404, "user not found"));
    }
    const validPassword = await bcrypt.compare(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, "wrong username or password"));
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

export const google = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });

    if (user) {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
      res.cookie("access_token", token, { httpOnly: true });
      delete user.password;
      res.send({
        success: true,
        user,
        token,
      });
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);

      const newUser = await prisma.user.create({
        data: {
          username:
            req.body.name.split(" ").join("").toLowerCase() +
            Math.random().toString(36).slice(-4),
          email: req.body.email,
          password: hashedPassword,
          avatar: req.body.photo,
        },
      });

      const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET);
      res.cookie("access_token", token, { httpOnly: true });
      delete newUser.password;
      res.send({
        success: true,
        newUser,
        token,
      });
    }
  } catch (error) {
    next(error);
  }
};
