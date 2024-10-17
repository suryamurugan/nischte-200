import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors());

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Route Dec

import shopRouter from "../src/routes/shop.route.js";
import shopMenuRouter from "../src/routes/menu.route.js";
import userMenuViewRouter from "../src/routes/userMenu.route.js";
import orderRouter from "../src/routes/order.route.js";
import offerRouter from "../src/routes/offer.route.js";

app.use("/api/v1/shop", shopMenuRouter);
app.use("/api/v1/shop", shopRouter);
// app.use("/api/v1/shops", userMenuViewRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/offer", offerRouter);

export default app;
