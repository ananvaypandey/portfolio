import type { Metadata } from "next";
import { Caveat, Geist_Mono, Patrick_Hand } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ApplyFloat from "@/components/ApplyFloat";
import { site } from "@/lib/site";

const patrickHand = Patrick_Hand({
  variable: "--font-patrick",
  weight: "400",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${site.name} — ${site.role}`,
  description: site.tagline,
  openGraph: {
    title: `${site.name} — ${site.role}`,
    description: site.tagline,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${patrickHand.variable} ${caveat.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="ruled flex min-h-full flex-col bg-background font-sans text-foreground pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <ApplyFloat />
      </body>
    </html>
  );
}