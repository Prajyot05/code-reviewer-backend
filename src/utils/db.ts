import mongoose from "mongoose";

export const connectToDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI!;

  mongoose
    .connect(MONGODB_URI, {
      dbName: "code_reviewer",
    })
    .then((c) => {
      console.log(`>>>>>>>>>DB connected to ${c.connection.host}<<<<<<<<<`);
    })
    .catch((err) => console.log("Error connecting to MongoDB: ", err));
};
