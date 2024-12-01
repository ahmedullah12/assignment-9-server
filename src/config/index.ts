import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    hash_salt_round: process.env.HASH_SALT_ROUND,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET, 
    refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN, 
    access_token_secret: process.env.ACCESS_TOKEN_SECRET, 
    access_token_expires_in: process.env.ACCESS_TOKEN_EXPIRES_IN, 
}