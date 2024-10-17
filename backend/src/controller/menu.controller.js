import { Menu } from "../models/menu.models.js";
import { Shop } from "../models/shop.model.js";
import { uploadFile } from "../service/minio.service.js";

export const createMenu = async (req, res) => {
  try {
    const shopId = req.params.shopId;
    const { itemName, itemDescription, price, offerId } = req.body;

    const checkForShop = await Shop.findById(shopId);
    if (!checkForShop) {
      throw new Error("Shop doesn't exist");
    }

    let menu = await Menu.findOne({ shopId });

    if (menu) {
      const existingItem = menu.items.find(
        (item) => item.itemName === itemName
      );

      if (existingItem) {
        throw new Error("Item name already exists");
      }

      let pictureUrl = null;
      if (req.file) {
        pictureUrl = await uploadFile(req.file);
      }

      menu.items.push({
        itemName,
        itemDescription,
        price,
        picture: pictureUrl,
        offerId,
      });
      const updatedMenu = await menu.save();
      res.status(200).json(updatedMenu);
    } else {
      let pictureUrl = null;
      if (req.file) {
        pictureUrl = await uploadFile(req.file);
      }

      const newMenu = new Menu({
        items: [
          {
            itemName,
            itemDescription,
            price,
            picture: pictureUrl,
            offerId,
          },
        ],
        shopId,
      });

      const savedMenu = await newMenu.save();
      res.status(200).json(savedMenu);
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to create the menu",
      error: error.message,
    });
  }
};

export const getMenuItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const menu = await Menu.findOne({ "items._id": itemId }, { "items.$": 1 });

    if (!menu) {
      return res.status(404).json({ message: "Menu or item not found" });
    }

    const item = menu.items[0];

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get the menu item",
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

export const getXitems = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const menus = await Menu.find();

    const allItems = menus.reduce((acc, menu) => {
      return acc.concat(menu.items);
    }, []);

    const shuffledItems = allItems.sort(() => 0.5 - Math.random());

    const randomItems = shuffledItems.slice(0, limit);

    res.status(200).json(randomItems);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get the menu",
      error: error.message,
    });
  }
};

export const updateMenu = async (req, res) => {
  try {
    const menuId = req.params.menuId;
    const itemId = req.params.itemId;
    const shopId = req.params.shopId;

    const checkForShop = await Shop.findById(shopId);
    if (!checkForShop) {
      return res.status(404).json({ message: "Shop doesn't exist" });
    }

    const { itemName } = req.body;

    const menu = await Menu.findById(menuId);
    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    const duplicateItem = menu.items.find(
      (item) => item.itemName === itemName && item._id.toString() !== itemId
    );

    if (duplicateItem) {
      return res
        .status(400)
        .json({ message: "Item name already exists in this shop's menu" });
    }

    const updatedMenu = await Menu.findOneAndUpdate(
      { _id: menuId, "items._id": itemId },
      {
        $set: {
          "items.$.itemName": req.body.itemName,
          "items.$.itemDescription": req.body.itemDescription,
          "items.$.price": req.body.price,
          "items.$.category": req.body.category,
          "items.$.picture": req.body.picture,
        },
      },
      { new: true }
    );

    if (!updatedMenu) {
      return res
        .status(404)
        .json({ message: "Menu item not found while updating!" });
    }

    res.status(200).json(updatedMenu);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update menu",
      error: error.message,
    });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const shopId = req.params.shopId;
    const itemId = req.params.itemId;

    console.log("first");
    const checkForShop = await Shop.findById(shopId);
    if (!checkForShop) {
      return res.status(404).json({ message: "Shop doesn't exist" });
    }

    const updatedMenu = await Menu.findOneAndUpdate(
      { shopId, "items._id": itemId },
      { $pull: { items: { _id: itemId } } },
      { new: true }
    );

    if (!updatedMenu) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.status(200).json({
      message: "Menu item has been deleted successfully!",
      updatedMenu,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete the menu item",
      error: error.message,
    });
  }
};
