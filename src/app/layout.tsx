import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MenuBarComponent from "@/shared/MenuBarComponent";
import SideBarComponent from "@/shared/SidebarComponent";
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rooms Management",
  description: "Your APP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`w-[1300px] mx-auto ${inter.className}`}>
        <MenuBarComponent />
        <main className="grid grid-cols-[300px_minmax(900px,_1fr)] gap-4">
          <SideBarComponent />
          <main>{children}</main>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
