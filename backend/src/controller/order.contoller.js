import { Order } from "../models/order.model.js";

export const order = async (req, res) => {
  try {
    const { userId, deliveryId, totalAmt, offerId, transactionId } = req.body;
    const order = new Order({
      userId,
      deliveryId,
      totalAmt,
      offerId,
      transactionId,
    });
    const savedOrder = await order.save();
    res.status(200).json(savedOrder);
  } catch (error) {
    res.status(500).json({
      message: "Failed to place the order",
      error: error.message,
    });
  }
};

export const getAllUserOrder = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userOrder = await Order.find({ userId });
    res.status(200).json(userOrder);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get all the user order",
      error: error.message,
    });
  }
};

export const getSpecificOrderDetails = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    // console.log("order id", orderId);
    const order = await Order.findById(orderId);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get the order details",
      error: error.message,
    });
  }
};
