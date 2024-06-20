import jwt from "jsonwebtoken";
import prisma from "../../prisma/prismaClient.js";

export const test = async (req, res) => {
  const token = await req.headers.authorization.split(" ")[1];
  const userId = jwt.verify(token, process.env.JWT_SECRET);

  const user = await prisma.user.findUnique({
    where: {
      id: userId.id,
    },
  });
  delete user.password;
  res.send({
    success: true,
    user,
  });
};
