"use client";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/features/shared/components/ui/tabs";

import { ClassicBarChart } from "./bar-charts/classic-bar-chart";
import { HorizontalBarChart } from "./bar-charts/horizontal-bar-chart";
import { GroupedBarChart } from "./bar-charts/grouped-bar-chart";
import { WaterfallChart } from "./bar-charts/waterfall-chart";
import { TornadoChart } from "./bar-charts/tornado-chart";

import { BoxPlot } from "./box-plots/box-plot";
import { GroupedBoxPlot } from "./box-plots/grouped-box-plot";
import { ViolinPlot } from "./box-plots/violin-plot";

import { ClassicScatter } from "./scatter-plots/classic-scatter";
import { ScatterRegression } from "./scatter-plots/scatter-regression";
import { ScatterConfidenceBand } from "./scatter-plots/scatter-confidence-band";
import { ObservedVsPredicted } from "./scatter-plots/observed-vs-predicted";

import { ClassicLineChart } from "./line-charts/classic-line-chart";
import { SigmoidLineChart } from "./line-charts/sigmoid-line-chart";
import { DualAxisLineChart } from "./line-charts/dual-axis-line-chart";
import { SemiLogLineChart } from "./line-charts/semi-log-line-chart";

import { ContourPlot } from "./contour-plot/contour-plot";

import { HeatMap } from "./heat-maps/heat-map";
import { SpatialHeatMap } from "./heat-maps/spatial-heat-map";

const categories = [
  { value: "bar", label: "Bar Charts" },
  { value: "box", label: "Box Plots" },
  { value: "scatter", label: "Scatter Plots" },
  { value: "line", label: "Line Charts" },
  { value: "contour", label: "Contour" },
  { value: "heatmap", label: "Heat Maps" },
] as const;

export function PlotPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Plot Gallery</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Interactive chart types with editable mock data. Switch between sliders, number inputs, and table editing below each chart.
          </p>
        </header>

        <Tabs defaultValue="bar">
          <TabsList className="mb-6 flex flex-wrap h-auto gap-1">
            {categories.map((cat) => (
              <TabsTrigger key={cat.value} value={cat.value}>
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="bar" className="space-y-6">
            <ClassicBarChart />
            <HorizontalBarChart />
            <GroupedBarChart />
            <WaterfallChart />
            <TornadoChart />
          </TabsContent>

          <TabsContent value="box" className="space-y-6">
            <BoxPlot />
            <GroupedBoxPlot />
            <ViolinPlot />
          </TabsContent>

          <TabsContent value="scatter" className="space-y-6">
            <ClassicScatter />
            <ScatterRegression />
            <ScatterConfidenceBand />
            <ObservedVsPredicted />
          </TabsContent>

          <TabsContent value="line" className="space-y-6">
            <ClassicLineChart />
            <SigmoidLineChart />
            <DualAxisLineChart />
            <SemiLogLineChart />
          </TabsContent>

          <TabsContent value="contour" className="space-y-6">
            <ContourPlot />
          </TabsContent>

          <TabsContent value="heatmap" className="space-y-6">
            <HeatMap />
            <SpatialHeatMap />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
