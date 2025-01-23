import { Router } from "express";
import { supportMessage } from "../controller/support.controller.js";

const router = Router();

router.route("/").post(supportMessage);

export default router;
