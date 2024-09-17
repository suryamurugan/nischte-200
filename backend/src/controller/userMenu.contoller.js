import { Menu } from "../models/menu.models.js";
import { Shop } from "../models/shop.model.js";

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
    const menu = await Menu.find({ shopId });
    res.status(200).json(menu);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get all menu of the X shop",
      error: error.message,
    });
  }
};
