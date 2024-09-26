import { Menu } from "../models/menu.models.js";
import { Shop } from "../models/shop.model.js";
import { Offer } from "../models/offer.model.js";
import { executeOfferRules } from "../service/offerRule.js";

export const getAllAvaiableShops = async (req, res) => {
  try {
    const shops = await Shop.find();
    res.status(200).json(shops);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get all avaiable shops",
      error: error.message,
    });
  }
};

export const getMenuOfAShop = async (req, res) => {
  try {
    const shopId = req.params.shopId;
    const menu = await Menu.findOne({ shopId });

    const visitCount = await Order.countDocuments({
      // userId: req.user.id,
      userId: req.body.userId,
      shopId,
    });

    const allOfferIds = menu.items.map((item) => item.offerId);
    const offers = await Offer.find({ _id: { $in: allOfferIds } });

    const items = await Promise.all(
      menu.items.map(async (item) => {
        const itemOffers = offers.filter((offer) =>
          offer._id.equals(item.offerId)
        );

        const validatedOffers = await Promise.all(
          itemOffers.map((offer) => executeOfferRules(offer, visitCount))
        );

        return { ...item, validatedOffers };
      })
    );

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get the menu",
      error: error.message,
    });
  }
};
