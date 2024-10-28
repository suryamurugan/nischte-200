import { Support } from "../models/support.model.js";

export const supportMessage = async (req, res) => {
  try {
    const { userId } = req.params;
    const { description } = req.body;
    const supportMsg = await new Support({
      userId,
      description,
    });
    res.status(200).json(supportMsg);
  } catch (error) {
    res.status(500).json({
      message: "Failed to submit msg!",
    });
  }
};
