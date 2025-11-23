import { PrismaClient } from "~/prisma/generated/client";

const prisma = new PrismaClient({ accelerateUrl: "asd" });

export default prisma;
