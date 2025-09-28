import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "./providers";

// Import font with variable
const geistSans = Raleway({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-suse",
});

export const metadata: Metadata = {
  title: "UniCore Protocol - AI-Powered Cross-Chain DeFi",
  description:
    "Experience the future of DeFi with zero-knowledge privacy, intelligent route optimization, and seamless cross-chain liquidity aggregation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
