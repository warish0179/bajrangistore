import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies, headers } from "next/headers";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET || "bajrangistore-super-secret-jwt-key-2026-production-ready";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "SELLER" | "ADMIN" | "DELIVERY_WORKER";
  avatar?: string | null;
  storeSlug?: string | null;
  walletBalance?: number;
}

export function signToken(user: SessionUser): string {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      storeSlug: user.storeSlug,
      walletBalance: user.walletBalance,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function verifyToken(token: string): SessionUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionUser;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    let token = cookieStore.get("bajrangi_token")?.value || cookieStore.get("nexmart_token")?.value;

    if (!token) {
      const headerList = await headers();
      const authHeader = headerList.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    if (!token || token.trim() === "" || token === "deleted") {
      return null;
    }

    return verifyToken(token);
  } catch {
    return null;
  }
}

export async function getCurrentUserFromDb() {
  const session = await getSessionUser();
  if (!session) return null;
  return prisma.user.findUnique({
    where: { id: session.id },
    include: {
      sellerProfile: true,
      deliveryProfile: true,
      addresses: true,
    },
  });
}
