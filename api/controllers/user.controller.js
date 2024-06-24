import jwt from "jsonwebtoken";
import prisma from "../../prisma/prismaClient.js";

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
