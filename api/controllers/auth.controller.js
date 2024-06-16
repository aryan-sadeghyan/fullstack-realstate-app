import prisma from "../../prisma/prismaClient.js";
import bcrypt from "bcrypt";

export const signup = async (req, res) => {
  const { username, email, password } = req.body;
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
    res.send({
      success: false,
      error: error.message,
    });
  }
};
