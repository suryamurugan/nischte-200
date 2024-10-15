import express, { Router } from "express";
import {
  createShop,
  deleteUser,
  getAllOwnerShops,
  getShop,
  getShops,
  updateShop,
} from "../controller/shop.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.route("/").post(upload.single("picture"), createShop);
router.route("/").get(getShops);
router.route("/:id").get(getShop);
router.route("/own/:ownerId").get(getAllOwnerShops);
router.route("/:id").patch(updateShop);
router.route("/:id").delete(deleteUser);

export default router;
