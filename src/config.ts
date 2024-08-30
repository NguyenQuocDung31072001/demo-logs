require("dotenv").config();

export const env = process.env.NODE_ENV || "local";

const config = {
  AWS_S3_BUCKET: "ama-pmp-dev",
  AWS_REGION: process.env.AWS_REGION,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || "",
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || "",
};
export default config;
