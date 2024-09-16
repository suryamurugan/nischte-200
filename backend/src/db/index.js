import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // console.log(process.env.DB_URI);
    const dbConnection = await mongoose.connect(
      `${process.env.DB_URI}/${process.env.DB_NAME}`
    );
    console.log(`Connected to db: ${dbConnection.connection.host}`);
  } catch (error) {
    console.log("dbConnection Failed: ", error);
    process.exit(1);
  }
};

export default connectDB;
