import type { Metadata } from "next";
import { PlotPage } from "@/features/plot/components/plot-page";

export const metadata: Metadata = {
  title: "Plot Gallery | Analytics Dashboard",
  description: "Interactive chart gallery with editable mock data",
};

export default function PlotRoute() {
  return <PlotPage />;
}
