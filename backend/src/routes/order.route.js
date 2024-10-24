import express, { Router } from "express";
import {
  createOrder,
  deleteOrder,
  getAllUserOrder,
  getSpecificOrderDetails,
} from "../controller/order.contoller.js";

const router = Router();

router.route("/").post(createOrder);
router.route("/past/:userId").get(getAllUserOrder);
router.route("/:orderId").get(getSpecificOrderDetails);
router.route("/:orderId").delete(deleteOrder); //On-hold

export default router;
