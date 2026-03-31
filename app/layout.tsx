import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { AppShell } from "@/components/app-shell";
import { GlobalBackground } from "@/components/global-background";
import "./globals.css";
import "../styles/scrollReveal.css";

export const metadata: Metadata = {
  title: "Mea Culpa - Inventario",
  description: "Dungeons & Dragons - Inventario, Gremios, Tiendas y Economía",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  return (
    <html lang="es">
      <body className="min-h-screen antialiased">
        <GlobalBackground />
        <AppShell session={session}>{children}</AppShell>
      </body>
    </html>
  );
}
