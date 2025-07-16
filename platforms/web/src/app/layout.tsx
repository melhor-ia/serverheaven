import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://serverheaven.co'),
  title: "Server Heaven | Find or Host the Perfect Minecraft Server",
  description: "Smart matchmaking for Minecraft communities. Connect with trusted players and servers through verified reputation systems and transparent community feedback.",
  keywords: [
    "Minecraft Server",
    "Server Hosting",
    "Minecraft Community",
    "Trusted Servers",
    "ServerHeaven"
  ],
  openGraph: {
    title: "Server Heaven | Find or Host the Perfect Minecraft Server",
    description: "Smart matchmaking for Minecraft communities. Connect with trusted players and servers through verified reputation systems and transparent community feedback.",
    url: "/",
    siteName: "Server Heaven",
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: "Server Heaven"
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Server Heaven | Find or Host the Perfect Minecraft Server",
    description: "Smart matchmaking for Minecraft communities. Connect with trusted players and servers through verified reputation systems and transparent community feedback.",
    images: ["/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 text-white min-h-screen`}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <main className="flex-grow">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
