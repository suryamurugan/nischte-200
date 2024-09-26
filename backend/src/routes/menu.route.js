import express, { Router } from "express";
import {
  createMenu,
  getMenuItem,
  updateMenu,
  deleteItem,
  getAllMenuOfShop,
} from "../controller/menu.controller.js";

const router = Router();

router.route("/:shopId/menu").post(createMenu);
router.route("/:shopId/menu").get(getAllMenuOfShop);
router.route("/menu/:menuId/item/:itemId").get(getMenuItem);
router.route("/:shopId/menu/:menuId/item/:itemId").patch(updateMenu);
router.route("/:shopId/menu/:itemId").delete(deleteItem);

export default router;
