import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  hash_salt_round: process.env.HASH_SALT_ROUND,
  refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
  refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  access_token_expires_in: process.env.ACCESS_TOKEN_EXPIRES_IN,
  reset_pass_secret: process.env.RESET_PASS_TOKEN,
  reset_pass_token_expires_in: process.env.RESET_PASS_TOKEN_EXPIRES_IN,
  reset_pass_link: process.env.RESET_PASS_LINK,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  email_user: process.env.EMAIL_USER,
  email_pass: process.env.EMAIL_PASS,
};
