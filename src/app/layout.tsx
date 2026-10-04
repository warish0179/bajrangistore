import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { SupportChatModal } from "@/components/support/SupportChatModal";

export const metadata: Metadata = {
  title: "NexMart | The Modern Hyper-Store",
  description: "Next-gen shopping delivered instantly. Explore thousands of top-tier electronics, fashion, home essentials, and limited flash deals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-brand-500 selection:text-white">
        <Providers>
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
