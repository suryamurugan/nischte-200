import { Menu } from "../models/menu.models.js";
import { Offer } from "../models/offer.model.js";

export const createOffer = async (req, res) => {
  try {
    console.log("first");
    const { shopId, itemId, offerType, offerDescription, _isActive } = req.body;

    let isOfferExist = await Offer.findOne({ shopId, itemId });

    if (isOfferExist) {
      const newOffer = {
        offerType: { name: offerType.name },
        offerDescription: {
          discountRate: offerDescription.discountRate,
          minOrder: offerDescription.minOrder,
          plusOffers: offerDescription.plusOffers,
          specialOccasionDate: offerDescription.specialOccasionDate,
          discountDishes: offerDescription.discountDishes,
          numberOfVisits: offerDescription.numberOfVisits,
          description: offerDescription.description,
        },
        _isActive,
      };

      isOfferExist.offers.push(newOffer);
      const savedOffer = await isOfferExist.save();
      const newSubDocumentId =
        savedOffer.offers[savedOffer.offers.length - 1]._id;

      await Menu.updateOne(
        { shopId, "items._id": itemId },
        { $push: { "items.$.offerId": newSubDocumentId } }
      );

      return res.status(200).json(savedOffer);
    } else {
      const newOfferDocument = new Offer({
        shopId,
        itemId,
        offers: [
          {
            offerType: { name: offerType.name },
            offerDescription: {
              discountRate: offerDescription.discountRate,
              minOrder: offerDescription.minOrder,
              plusOffers: offerDescription.plusOffers,
              specialOccasionDate: offerDescription.specialOccasionDate,
              discountDishes: offerDescription.discountDishes,
              numberOfVisits: offerDescription.numberOfVisits,
              description: offerDescription.description,
            },
            _isActive,
          },
        ],
      });

      const savedNewOffer = await newOfferDocument.save();
      const newSubDocumentId = savedNewOffer.offers[0]._id;

      await Menu.updateOne(
        { shopId, "items._id": itemId },
        { $push: { "items.$.offerId": newSubDocumentId } }
      );

      return res.status(201).json(savedNewOffer);
    }
  } catch (error) {
    return res.status(500).json({
      message: "Not able to create offer",
      error: error.message,
    });
  }
};

export const getAllOffers = async (req, res) => {
  try {
    const shopId = req.params.shopId;
    const itemId = req.params.itemId;
    const offers = await Offer.find({
      shopId,
      itemId,
      "offers._isActive": true,
    });
    res.status(200).json({
      message: "Offers retrieved successfully",
      offers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to retrieve offers",
      error: error.message,
    });
  }
};

export const getSpecificOfferDetails = async (req, res) => {
  try {
    const offer = await Offer.find(
      {
        "offers._id": req.params.id,
      },
      { "offers.$": 1 }
    );
    if (!offer) {
      return res.status(404).json({
        message: "Offer not found",
      });
    }
    res.status(200).json({
      message: "Offer retrieved successfully",
      offer,
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to retrieve the offer",
      error: error.message,
    });
  }
};

export const updateOffer = async (req, res) => {
  try {
    const { offerType, offerDescription, _isActive } = req.body;
    const offerId = req.params.id;
    const offer = await Offer.findOne({
      "offers._id": offerId,
    });

    if (!offer) {
      throw new Error("Offer not found!");
    }

    const offerToBeUpdated = offer.offers.find(
      (offer) => offer._id.toString() === offerId
    );

    if (!offerToBeUpdated) {
      throw new Error("There is no offer that exists!");
    }

    offerToBeUpdated.offerDescription = {
      discountRate: offerDescription.discountRate,
      minOrder: offerDescription.minOrder,
      plusOffers: offerDescription.plusOffers,
      specialOccasionDate: offerDescription.specialOccasionDate,
      discountDishes: offerDescription.discountDishes,
      numberOfVisits: offerDescription.numberOfVisits,
      description: offerDescription.description,
    };
    offerToBeUpdated._isActive = _isActive;

    const updatedOffer = await offer.save();

    res.status(200).json({
      message: "Offer updated successfully",
      offer: updatedOffer,
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to update the offer",
      error: error.message,
    });
  }
};

export const deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const { shopId, itemId } = req.body;

    const updatedOffer = await Offer.findOneAndUpdate(
      { shopId, itemId },
      { $pull: { offers: { _id: id } } },
      { new: true }
    );

    if (!updatedOffer) {
      return res.status(404).json({
        message: "Offer not found",
      });
    }

    await Menu.updateOne(
      {
        shopId,
        "items._id": itemId,
      },
      {
        $pull: {
          "items.$.offerId": id,
        },
      }
    );

    res.status(200).json({
      message: "Offer deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to delete the offer",
      error: error.message,
    });
  }
};
