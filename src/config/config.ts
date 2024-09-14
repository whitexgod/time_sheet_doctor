import dotenv from "dotenv";

dotenv.config();

const config = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  TIME_ZONE: process.env.TIME_ZONE || "Asia/Kolkata",
  PERFORMERS: process.env.PERFORMERS,
  EVENTS: process.env.EVENTS,
};

export default config;
