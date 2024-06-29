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

export const getListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userListings = await prisma.listing.findMany({
      where: {
        userRef: id,
      },
    });
    res.send({
      success: true,
      userListings,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    const listing = await prisma.listing.findUnique({
      where: {
        id: req.params.id,
      },
    });
    if (!listing) {
      res.send({
        success: false,
        message: "no listing exist with this id",
      });
    }

    if (req.user.id !== listing.userRef) {
      res.send({
        success: false,
        message: "you can only delete ur own listings!",
      });
    }

    await prisma.listing.delete({
      where: {
        id: req.params.id,
      },
    });

    res.send({
      success: true,
      message: "listing has been deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
