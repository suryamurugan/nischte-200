import { Router } from "express";
import {
  checkout,
  paymentVerification,
} from "../controller/payment.controller.js";

const router = Router();

router.route("/checkout").post(checkout);
router.route("/paymentVerification").post(paymentVerification);

export default router;
