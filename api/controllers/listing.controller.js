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

export const getListings = async (req, res, next) => {
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

export const updateListing = async (req, res, next) => {
  try {
    const { listingId } = req.params;

    // Check if listingId is provided
    if (!listingId) {
      return res.status(400).send({
        success: false,
        message: "listingId is required in the URL parameters.",
      });
    }

    // Destructure req.body and exclude fields like createdAt, updatedAt, id
    const { createdAt, updatedAt, id, ...updatedData } = req.body;

    const updatedListing = await prisma.listing.update({
      where: {
        id: listingId,
      },
      data: {
        ...updatedData,
      },
    });

    res.status(200).send({
      success: true,
      updatedListing,
    });
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await prisma.listing.findUnique({
      where: {
        id: req.params.listingId,
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

export const getSearchedListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    let offer = req.query.offer;
    if (offer === undefined || offer === "false") {
      offer = undefined;
    } else {
      offer = offer === "true";
    }

    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      furnished = undefined;
    } else {
      furnished = furnished === "true";
    }

    let parking = req.query.parking;
    if (parking === undefined || parking === "false") {
      parking = undefined;
    } else {
      parking = parking === "true";
    }

    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = undefined;
    }

    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";

    const listings = await prisma.listing.findMany({
      where: {
        name: {
          contains: searchTerm,
          mode: "insensitive",
        },
        offer: offer === undefined ? undefined : offer,
        furnished: furnished === undefined ? undefined : furnished,
        parking: parking === undefined ? undefined : parking,
        type: type === undefined ? undefined : type,
      },
      orderBy: {
        [sort]: order,
      },
      take: limit,
      skip: startIndex,
    });

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
