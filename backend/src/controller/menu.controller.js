// This menu controller is for shop owner
import { Menu } from "../models/menu.models.js";
import { Shop } from "../models/shop.model.js";

export const createMenu = async (req, res) => {
  try {
    const shopId = req.params.shopId;
    const { itemName, itemDescription, price, category, picture, offerId } =
      req.body;
    const menu = new Menu({
      itemName,
      itemDescription,
      price,
      category,
      picture,
      shopId,
      offerId,
    });

    const checkForShop = await Shop.findById(shopId);

    if (!checkForShop) {
      return res.status(404).json({
        message: "Shop doesn't exist",
        error: error.message,
      });
    }

    const checkForItemNameExist = await Menu.findOne({
      shopId,
      itemName,
    });

    if (checkForItemNameExist) {
      return res.status(400).json({
        message: "Item with the name already exist",
        error: error.message,
      });
    }

    const savedMenu = await menu.save();
    res.status(200).json(savedMenu);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create the menu",
      error: error.message,
    });
  }
};

//Gets a particular menu of a shop
export const getMenu = async (req, res) => {
  try {
    const menuId = req.params.id;
    const menu = await Menu.findById(menuId);
    res.status(200).json(menu);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get a particular menu",
      error: error.message,
    });
  }
};

export const getAllMenuOfShop = async (req, res) => {
  try {
    const shopId = req.params.shopId;
    const checkForShop = await Shop.findById(shopId);

    if (!checkForShop) {
      return res.status(404).json({
        message: "Shop doesn't exist",
        error: error.message,
      });
    }

    const menu = await Menu.find({
      shopId,
    });
    res.status(200).json(menu);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get the menu",
      error: error.message,
    });
  }
};

export const updateMenu = async (req, res) => {
  try {
    const menuId = req.params.id;
    const shopId = req.params.shopId;
    const checkForShop = await Shop.findById(shopId);

    if (!checkForShop) {
      return res.status(404).json({
        message: "Shop doesn't exist",
        error: error.message,
      });
    }

    const { itemName } = req.body;
    const checkForItemNameExist = await Menu.findOne({
      shopId,
      itemName,
    });

    if (checkForItemNameExist) {
      return res.status(400).json({
        message: "Item with the name already exist",
        error: error.message,
      });
    }

    const updatedMenu = await Menu.findByIdAndUpdate(
      menuId,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    res.status(200).json(updatedMenu);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update menu",
      error: error.message,
    });
  }
};

export const deleteMenu = async (req, res) => {
  try {
    const menuId = req.params.id;
    await Menu.findByIdAndDelete(menuId);
    res.status(200).json({
      message: "Menu has been deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete the menu",
      error: error.message,
    });
  }
};
