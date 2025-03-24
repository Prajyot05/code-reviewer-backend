import mongoose from "mongoose";

export const connectToDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI!;

  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log(">>>>>>>>>Connected to MongoDB<<<<<<<<<");
    })
    .catch((err) => console.log("Error connecting to MongoDB: ", err));
};
