import express, { Router } from "express";
import {
  createOffer,
  deleteOffer,
  getAllOffers,
  getSpecificOfferDetails,
  isOfferEligible,
  offerWithOutMetaData,
  updateOffer,
} from "../controller/offer.controller.js";

const router = Router();

router.route("/applicable").get(offerWithOutMetaData);
router.route("/").post(createOffer);
router.route("/:shopId/:itemId").get(getAllOffers);
router.route("/:id").get(getSpecificOfferDetails);
router.route("/:id").patch(updateOffer);
router.route("/:id").delete(deleteOffer);
router.route("/eligible").post(isOfferEligible);

export default router;
