import express, { Router } from "express";
import {
  createShop,
  deleteUser,
  getShop,
  updateShop,
} from "../controller/shop.controller.js";

const router = Router();

router.route("/").post(createShop);
router.route("/:id").get(getShop);
router.route("/:id").patch(updateShop);
router.route("/:id").delete(deleteUser);

export default router;
