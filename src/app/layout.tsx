import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "sonner";
import { CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kasbon - Catat Utang Piutang Pribadi",
  description:
    "Aplikasi sederhana untuk mencatat dan mengelola utang piutang pribadi dengan aman dan realtime.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={poppins.variable}>
      <body className="font-sans antialiased bg-[#F8FAFC] text-zinc-900 min-h-screen">
        {children}
        <Toaster
          position="top-right"
          closeButton
          toastOptions={{
            style: {
              borderRadius: "12px",
              fontFamily: "var(--font-poppins), sans-serif",
              fontSize: "12px",
              fontWeight: "600",
              border: "1px solid #e4e4e7",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              backgroundColor: "#ffffff",
              color: "#09090b",
            },
          }}
          icons={{
            success: <CheckCircle2 className="w-4 h-4 text-[#D94E15]" />,
            error: <AlertCircle className="w-4 h-4 text-rose-600" />,
            info: <Info className="w-4 h-4 text-blue-600" />,
            warning: <AlertTriangle className="w-4 h-4 text-amber-600" />,
          }}
        />
      </body>
    </html>
  );
}
