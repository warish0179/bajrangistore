import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function performLogout(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("bajrangi_token");
    cookieStore.delete("nexmart_token");
  } catch {
    // silent
  }

  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  };

  response.cookies.set("bajrangi_token", "", cookieOptions);
  response.cookies.set("nexmart_token", "", cookieOptions);
  response.cookies.delete("bajrangi_token");
  response.cookies.delete("nexmart_token");

  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");

  return response;
}

export async function POST(req: NextRequest) {
  return performLogout(req);
}

export async function GET(req: NextRequest) {
  return performLogout(req);
}
