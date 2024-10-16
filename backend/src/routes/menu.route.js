import express, { Router } from "express";
import {
  createMenu,
  getMenuItem,
  updateMenu,
  deleteItem,
  getAllMenuOfShop,
  getXitems,
} from "../controller/menu.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.route("/menu").get(getXitems);
router.route("/:shopId/menu").post(upload.single("picture"), createMenu);
router.route("/:shopId/menu").get(getAllMenuOfShop);
router.route("/:shopId/menu/:itemId").get(getMenuItem);
router.route("/:shopId/menu/:menuId/item/:itemId").patch(updateMenu);
router.route("/:shopId/menu/:itemId").delete(deleteItem);

export default router;
