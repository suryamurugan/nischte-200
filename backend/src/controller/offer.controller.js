import { Offer } from "../models/offer.model.js";

export const createOffer = async (req, res) => {
  try {
    const { shopId, itemId, offerType, offerDescription, _isActive } = req.body;

    if (!shopId || !itemId || !offerType || !offerDescription || !_isActive) {
      return res.status(400).json({
        message:
          "shopId, itemId, offerType, and offerDescription are required.",
      });
    }

    const newOffer = new Offer({
      shopId,
      itemId,
      offerType,
      offerDescription,
      _isActive,
    });

    const savedNewOffer = await newOffer.save();
    res.status(201).json(savedNewOffer);
  } catch (error) {
    res.status(500).json({
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
      _isActive: true,
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
    const offer = await Offer.findById(req.params.id);
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
    const { shopId, itemId, offerType, offerDescription, _isActive } = req.body;

    const updatedOffer = await Offer.findByIdAndUpdate(
      req.params.id,
      {
        shopId,
        itemId,
        offerType,
        offerDescription,
        _isActive,
      },
      { new: true, runValidators: true }
    );

    if (!updatedOffer) {
      return res.status(404).json({
        message: "Offer not found",
      });
    }

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
    const offer = await Offer.findByIdAndDelete(req.params.id);

    if (!offer) {
      return res.status(404).json({
        message: "Offer not found",
      });
    }

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
