import express, { Router } from "express";
import {
  createOffer,
  deleteOffer,
  getAllOffers,
  getSpecificOfferDetails,
  updateOffer,
} from "../controller/offer.controller.js";

const router = Router();

router.route("/").post(createOffer);
router.route("/:shopId/:itemId").get(getAllOffers);
router.route("/:id").get(getSpecificOfferDetails);
router.route("/:id").patch(updateOffer);
router.route("/:id").delete(deleteOffer);

export default router;
