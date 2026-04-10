import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

let prisma: InstanceType<typeof PrismaClient>;

declare global {
  var __prisma: InstanceType<typeof PrismaClient> | undefined;
}

function createClient() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });
  return new PrismaClient({ adapter });
}

if (process.env.NODE_ENV === "production") {
  prisma = createClient();
} else {
  if (!global.__prisma) {
    global.__prisma = createClient();
  }
  prisma = global.__prisma;
}

export { prisma };
