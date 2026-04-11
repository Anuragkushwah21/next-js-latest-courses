// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import SessionProviderWrapper from "./providers/SessionProviderWrapper";
import { getServerSession } from "next-auth";      // <- change import
import { authOptions } from "@/lib/auth";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Advanced Computer Classes - CPCT & Typing Course",
  description:
    "Learn Hindi & English Typing, CPCT, SSC Stenographer, MP High Court, Rajasthan High Court & all Government Exams preparation",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/img/logo.png",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </head>

      <body className="font-sans antialiased">
        <SessionProviderWrapper session={session}>
          <Navbar />
          {children}
          <Footer />
        </SessionProviderWrapper>
        <Analytics />
      </body>
    </html>
  );
}