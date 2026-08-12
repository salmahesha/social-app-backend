import dotenv from "dotenv"

export const NODE_ENV = process.env.NODE_ENV || "dev";

dotenv.config({path:"./.env.dev"});

export const PORT = process.env.PORT || 4000;

export const DB_NAME = process.env.DB_NAME || '';
export const REDIS_URL= process.env.REDIS_URL|| '';

export const DB_URL_LOCAL = process.env.DB_URL_LOCAL||"" ;
export const DB_URL_ATLAS = process.env.DB_URL_ATLAS||"" ;

export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY as string;
export const TOKEN_SIGNATURE_USER = process.env.TOKEN_SIGNATURE_USER as string;
export const TOKEN_SIGNATURE_ADMIN = process.env.TOKEN_SIGNATURE_ADMIN as string;
export const TOKEN_SIGNATURE_REFRESH_USER = process.env.TOKEN_SIGNATURE_REFRESH_USER as string;
export const TOKEN_SIGNATURE_REFRESH_ADMIN = process.env.TOKEN_SIGNATURE_REFRESH_ADMIN as string;

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
export const SALT_ROUND = parseInt(process.env.SALT_ROUND as string)||10;

export const USER_MAIL = process.env.USER_MAIL as string;
export const USER_PASS = process.env.USER_PASS as string;

