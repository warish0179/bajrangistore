import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { SupportChatModal } from "@/components/support/SupportChatModal";
import { BrandSplashScreen } from "@/components/common/BrandSplashScreen";
import { PincodeDeliveryModal } from "@/components/common/PincodeDeliveryModal";

export const metadata: Metadata = {
  title: "BajrangiStore | Bharat's Mega Marketplace",
  description:
    "India's premier multi-role shopping ecosystem with certified genuine products, verified UPI & Bank transfer checkout, doorstep OTP delivery, and dedicated seller/admin hubs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-amber-500 selection:text-white">
        <Providers>
          <BrandSplashScreen />
          <PincodeDeliveryModal />
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
          <SupportChatModal />
          <MobileNav />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
