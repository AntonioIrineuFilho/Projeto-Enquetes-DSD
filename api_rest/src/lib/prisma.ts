import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "~/prisma/generated/client";
import { env } from "prisma/config";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const adapter = new PrismaBetterSqlite3({
  url: env("PRISMA_DATABASE_URL"),
});

const prisma = new PrismaClient({
  adapter,
  log: ["error"],
});

export default prisma;
