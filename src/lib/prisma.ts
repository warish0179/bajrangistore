import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getResolvedDatabaseUrl(): string {
  // If user provided a remote database URL (e.g. PostgreSQL, MySQL, Turso)
  const envUrl = process.env.DATABASE_URL;
  if (envUrl && !envUrl.startsWith("file:")) {
    return envUrl;
  }

  // Candidate paths where dev.db can be located in local dev or Vercel serverless Lambda
  const candidates = [
    path.join(process.cwd(), "prisma", "dev.db"),
    path.join(process.cwd(), "dev.db"),
    path.resolve("./prisma/dev.db"),
    path.resolve("./dev.db"),
  ];

  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate)) {
        return `file:${candidate}`;
      }
    } catch {
      // ignore
    }
  }

  // Fallback to default relative to cwd
  return envUrl || `file:${path.join(process.cwd(), "prisma", "dev.db")}`;
}

const resolvedDbUrl = getResolvedDatabaseUrl();
process.env.DATABASE_URL = resolvedDbUrl;

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "bajrangi_enterprise_secret_2026_xyz";
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: resolvedDbUrl,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

