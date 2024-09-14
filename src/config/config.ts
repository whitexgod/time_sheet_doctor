import dotenv from "dotenv";

dotenv.config();

const config = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  TIME_ZONE: process.env.TIME_ZONE || "Asia/Kolkata",
  PERFORMERS: process.env.PERFORMERS,
  EVENTS: process.env.EVENTS,
  API_URL: process.env.API_URL,
  SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL,
  SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD,
  SESSION_SECRET: process.env.SESSION_SECRET
};

export default config;
