import prisma from "../../prisma/prismaClient.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await prisma.listing.create({
      data: {
        ...req.body,
      },
    });
    res.send({
      success: true,
      listing,
    });
  } catch (error) {
    next(error);
  }
};
