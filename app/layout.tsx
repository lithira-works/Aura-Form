import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CosmoPOS — Point of Sale",
  description: "Premium cosmetic shop POS & inventory management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
