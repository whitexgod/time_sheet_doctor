import mongoose from "mongoose";
import config from "../config/config";

function connectDatabase() {
  try {
    mongoose.connect(config.MONGO_URI!);

    const database = mongoose.connection;

    database.on("error", async (error) => {
      console.log("Error in MongoDb connection : " + error.message);
      await mongoose.disconnect();
      throw new Error(error);
    });

    database.once("open", () => {
      console.log("Database Connected successfully ✅");
    });
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message + "Failed To Connect to Database");
    } else {
      console.log("Caught and Unknown Error : ", Error);
    }
  }
}

export default connectDatabase;
