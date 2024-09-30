import localFont from "next/font/local";
import { Toaster } from "@/components/ui/toaster";
import "@/app/globals.css";

const loraSerif = localFont({
  src: "../fonts/LoraVF.ttf",
  variable: "--font-lora-serif",
  weight: "100 900",
});

const interSansSerif = localFont({
  src: "../fonts/InterVF.ttf",
  variable: "--font-inter-sans-serif",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${loraSerif.variable} ${interSansSerif.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
