import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/auth-provider";
import Navigation from "@/components/navigation";

const geistSans = "";
const geistMono = "";

export const metadata: Metadata = {
  title: "Client Engage Administration",
  description: "Admin application for data sync service logs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <Navigation />
          <main className="container mx-auto p-4">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
