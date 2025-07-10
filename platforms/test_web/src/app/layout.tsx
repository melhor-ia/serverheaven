import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Server Heaven",
  description: "Find your next gaming server.",
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
            <header className="bg-gray-800 p-4">
              <nav className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-xl font-bold">
                  ServerHeaven
                </Link>
                <div>
                  <Link href="/feed" className="text-gray-300 hover:text-white mr-4">
                    Feed
                  </Link>
                  {/* Other nav links can go here */}
                </div>
              </nav>
            </header>
            <main className="flex-grow container mx-auto p-4 flex justify-center items-start">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
