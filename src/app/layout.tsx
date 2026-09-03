import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kasbon - Track Utang Piutang Pribadi",
  description: "Aplikasi pencatat utang piutang pribadi berbasis Next.js 16 & Supabase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={poppins.variable}>
      <body
        className={`${poppins.className} antialiased selection:bg-[#FC5810] selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
