import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { AppShell } from "@/components/app-shell";
import "./globals.css";

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
        <AppShell session={session}>{children}</AppShell>
      </body>
    </html>
  );
}
