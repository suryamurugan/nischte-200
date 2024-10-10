import express, { Router } from "express";
import { callBack, Login } from "../controller/auth.controller.js";

const router = Router();

router.route("/login").get(Login);
router.route("/callback").get(callBack);

export default router;
