import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import ChatWidget from "@/components/chat/chat-widget";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "JalRakshak AI — Predict. Preserve. Prosper.",
  description:
    "Hyperlocal Water Intelligence & Climate-Risk Prediction for Agriculture",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
