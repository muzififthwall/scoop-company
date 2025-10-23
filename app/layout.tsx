import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Scoop Company — Scoop & Scream: Halloween Movie Night",
  description: "£10 per person • Any dessert + Any drink included. One frightfully sweet night in our cosy gelato parlour.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
