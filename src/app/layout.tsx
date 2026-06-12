import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Providers from "./providers";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TKnown — AI Brief Builder",
  description:
    "Đừng để AI đoán ý bạn. TKnown giúp bạn làm rõ mọi yêu cầu trước khi đưa cho AI thực thi.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark">
      <body className={`${jakarta.variable} antialiased`}>
        <Toaster
          position="top-center"
          richColors
          theme="dark"
          toastOptions={{
            style: {
              background: "#18181f",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "12px",
              fontSize: "0.9rem",
            },
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
