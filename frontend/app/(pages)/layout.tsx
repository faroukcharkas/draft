import localFont from "next/font/local";
import "@/app/globals.css";

const loraSerif = localFont({
  src: "../fonts/LoraVF.ttf",
  variable: "--font-lora-serif",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${loraSerif.variable} antialiased`}>{children}</body>
    </html>
  );
}
