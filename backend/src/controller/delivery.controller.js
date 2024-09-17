export const getDeliveryStat = async (req, res) => {
  try {
    //Will be Implemented after the payment
  } catch (error) {
    res.status(200).json({
      message: "Not able to get the delivery stats",
      error: error.message,
    });
  }
};
