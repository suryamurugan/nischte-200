import express, { Router } from "express";
import {
  getAllAvaiableShops,
  getMenuOfXShop,
} from "../controller/userMenu.contoller.js";

const router = Router();

router.route("/view").get(getAllAvaiableShops);
router.route("/:shopId/view/menu").get(getMenuOfXShop);

export default router;
