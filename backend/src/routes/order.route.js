import express, { Router } from "express";
import {
  getAllUserOrder,
  getSpecificOrderDetails,
  order,
} from "../controller/order.contoller.js";

const router = Router();

router.route("/").post(order);
router.route("/past/:userId").get(getAllUserOrder);
router.route("/:orderId").get(getSpecificOrderDetails);

export default router;
