import type { Metadata } from "next";
import { Inter, Piazzolla, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navigation from "@/src/components/header/navigation";

const piazzolla = Piazzolla({
  subsets: ["latin"],
  weight: "800",
  variable: "--nf-piazzolla",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--nf-jakarta",
});

const inter = Inter({
  subsets: ["latin"],
  weight: "400",
  variable: "--nf-inter",
});

export const metadata: Metadata = {
  title: "Ahoy — Explorar",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt"
      className={`${piazzolla.variable} ${jakarta.variable} ${inter.variable}`}
    >
      <body>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
