import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, "../../.env") });

// ======================
// Puerto
// ======================

export const SERVER_PORT: number = Number(process.env.SERVER_PORT) || 5000;

// ======================
// variables de servidor
// ======================

export const SERVER_HOSTNAME: string = process.env.DB_HOST || "localhost";

export const DB_PORT: number = Number(process.env.DB_PORT) || 3306;

export const SERVER_USER: string = process.env.DB_USER || "root";

export const SERVER_PASSWORD: string = process.env.DB_PASS || "";

export const SERVER_DATABASE: string = process.env.DB_DATABASE || "database";

// ======================
// Entorno
// ======================

export const NODE_ENV = process.env.NODE_ENV || "dev";

// ======================
// Vencimiento del Token
// ======================
// 60 seg
// 60 min
// 24 horas
// 30 dias

export const CADUCIDAD_TOKEN = process.env.CADUCIDAD_TOKEN || 60 * 60 * 24 * 30;

// ===============================
// SEED o semilla de autenticación
// ===============================

export const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY as string;

export const FORMAT_DATE_TIME = "YYYY-M-D HH:mm:ss";

export const FORMAT_DATE = "YYYY-M-D";
