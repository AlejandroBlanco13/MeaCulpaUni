import type { Metadata } from "next";
import { DndLegendScroll } from "@/components/dnd-legend-scroll";

export const metadata: Metadata = {
  title: "D&D — La Leyenda Comienza | Mea Culpa",
  description:
    "Adéntrate en un mundo de magia oscura, tesoros olvidados y criaturas que desafían la razón. La leyenda de Dungeons & Dragons.",
};

export default function LeyendaPage() {
  return <DndLegendScroll />;
}
