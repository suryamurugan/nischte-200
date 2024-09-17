import express, { Router } from "express";
import {
  deleteOrder,
  getAllUserOrder,
  getSpecificOrderDetails,
  order,
} from "../controller/order.contoller.js";

const router = Router();

router.route("/").post(order);
router.route("/past/:userId").get(getAllUserOrder);
router.route("/:orderId").get(getSpecificOrderDetails);
router.route("/:orderId").delete(deleteOrder);

export default router;
