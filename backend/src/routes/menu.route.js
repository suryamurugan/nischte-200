import express, { Router } from "express";
import {
  createMenu,
  getMenu,
  updateMenu,
  deleteMenu,
  getAllMenuOfShop,
} from "../controller/menu.controller.js";

const router = Router();

router.route("/:shopId/menu").post(createMenu);
router.route("/:shopId/menu").get(getAllMenuOfShop);
router.route("/:shopId/menu/:id").get(getMenu);
router.route("/:shopId/menu/:id").patch(updateMenu);
router.route("/:shopId/menu/:id").delete(deleteMenu);

export default router;
