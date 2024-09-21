import { Order } from "../models/order.model.js";
import { Ordered } from "../models/ordered.model.js";

export const order = async (req, res) => {
  try {
    const { userId, deliveryStatus, totalAmt, offerId, transactionId, items } =
      req.body;

    const order = new Order({
      userId,
      deliveryStatus,
      totalAmt,
      offerId,
      items,
      transactionId,
      offerId,
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
    const order = await Order.findById(orderId);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get the order details",
      error: error.message,
    });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    await Ordered.deleteMany({ orderId });
    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json({
      message: "Order and its items deleted successfully",
      deletedOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete order",
      error: error.message,
    });
  }
};
