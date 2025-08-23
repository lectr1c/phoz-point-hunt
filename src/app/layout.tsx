import "./globals.css";

import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import SignButton from "~/components/common/SignButton";
import { Toaster } from "~/components/ui/toaster";
import { HeaderServer } from "~/components/Header/HeaderServer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Phöz Poäng Jakt",
  description: "Samla era poäng Nollan!",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`font-sans ${inter.variable}`}>
          <HeaderServer>
            <Toaster />
          </HeaderServer>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
