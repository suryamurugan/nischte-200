import express, { Router } from "express";
import {
  getAllAvaiableShops,
  getMenuOfAShop,
} from "../controller/userMenu.contoller.js";

const router = Router();

router.route("/view").get(getAllAvaiableShops);
router.route("/:shopId/view/menu").get(getMenuOfAShop);

export default router;
