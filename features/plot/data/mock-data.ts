export interface BarDataPoint {
  label: string;
  value: number;
  value2?: number;
}

export interface GroupedBarDataPoint {
  label: string;
  group1: number;
  group2: number;
  group3: number;
}

export interface WaterfallDataPoint {
  label: string;
  value: number;
}

export interface TornadoDataPoint {
  label: string;
  positive: number;
  negative: number;
}

export interface BoxPlotStats {
  label: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
}

export interface GroupedBoxPlotStats {
  label: string;
  groupA: BoxPlotStats;
  groupB: BoxPlotStats;
}

export interface ViolinDataPoint {
  label: string;
  values: number[];
}

export interface ScatterDataPoint {
  x: number;
  y: number;
}

export interface LineDataPoint {
  x: number;
  y: number;
  y2?: number;
}

export interface HeatMapCell {
  row: number;
  col: number;
  value: number;
}

export interface SpatialHeatMapCell {
  row: string;
  col: string;
  value: number;
}

export const classicBarData: BarDataPoint[] = [
  { label: "A", value: 72 },
  { label: "B", value: 55 },
  { label: "C", value: 83 },
  { label: "D", value: 41 },
  { label: "E", value: 67 },
];

export const horizontalBarData: BarDataPoint[] = [
  { label: "Category 1", value: 78 },
  { label: "Category 2", value: 62 },
  { label: "Category 3", value: 45 },
];

export const groupedBarData: GroupedBarDataPoint[] = [
  { label: "Q1", group1: 65, group2: 48, group3: 72 },
  { label: "Q2", group1: 59, group2: 71, group3: 55 },
  { label: "Q3", group1: 80, group2: 63, group3: 68 },
  { label: "Q4", group1: 45, group2: 57, group3: 82 },
];

export const waterfallData: WaterfallDataPoint[] = [
  { label: "Start", value: 50 },
  { label: "P1", value: 20 },
  { label: "P2", value: -10 },
  { label: "P3", value: 35 },
  { label: "P4", value: -25 },
  { label: "P5", value: 15 },
  { label: "P6", value: -5 },
  { label: "P7", value: 30 },
];

export const tornadoData: TornadoDataPoint[] = [
  { label: "Param A", positive: 45, negative: -38 },
  { label: "Param B", positive: 32, negative: -28 },
  { label: "Param C", positive: 25, negative: -22 },
  { label: "Param D", positive: 18, negative: -15 },
  { label: "Param E", positive: 12, negative: -10 },
];

export const boxPlotData: BoxPlotStats[] = [
  { label: "4", min: 15, q1: 35, median: 55, q3: 72, max: 90 },
  { label: "8", min: 20, q1: 40, median: 60, q3: 75, max: 88 },
  { label: "12", min: 10, q1: 30, median: 48, q3: 65, max: 82 },
  { label: "16", min: 25, q1: 42, median: 58, q3: 70, max: 85 },
  { label: "20", min: 18, q1: 38, median: 52, q3: 68, max: 92 },
];

export const groupedBoxPlotData: GroupedBoxPlotStats[] = [
  {
    label: "4",
    groupA: { label: "4A", min: 20, q1: 35, median: 50, q3: 65, max: 80 },
    groupB: { label: "4B", min: 15, q1: 28, median: 42, q3: 58, max: 72 },
  },
  {
    label: "8",
    groupA: { label: "8A", min: 25, q1: 40, median: 55, q3: 70, max: 85 },
    groupB: { label: "8B", min: 18, q1: 32, median: 48, q3: 62, max: 78 },
  },
  {
    label: "16",
    groupA: { label: "16A", min: 22, q1: 38, median: 52, q3: 68, max: 82 },
    groupB: { label: "16B", min: 12, q1: 25, median: 38, q3: 55, max: 70 },
  },
];

export const violinData: ViolinDataPoint[] = [
  { label: "4", values: [30, 35, 38, 40, 42, 42, 45, 48, 50, 52, 55, 55, 55, 58, 60, 62, 65, 68, 70, 75] },
  { label: "8", values: [25, 30, 35, 40, 45, 48, 50, 50, 52, 55, 55, 58, 60, 60, 62, 65, 68, 70, 75, 80] },
  { label: "12", values: [20, 28, 35, 42, 45, 48, 50, 55, 58, 60, 62, 62, 65, 68, 70, 72, 75, 78, 82, 88] },
];

export const classicScatterData: ScatterDataPoint[] = [
  { x: 2, y: 35 }, { x: 4, y: 52 }, { x: 5, y: 48 },
  { x: 7, y: 65 }, { x: 8, y: 70 }, { x: 10, y: 58 },
  { x: 12, y: 78 }, { x: 14, y: 72 }, { x: 16, y: 85 },
  { x: 18, y: 80 }, { x: 20, y: 92 }, { x: 22, y: 88 },
];

export const scatterRegressionData: ScatterDataPoint[] = [
  { x: 1, y: 12 }, { x: 3, y: 25 }, { x: 4, y: 22 },
  { x: 6, y: 38 }, { x: 8, y: 45 }, { x: 9, y: 52 },
  { x: 11, y: 55 }, { x: 13, y: 62 }, { x: 15, y: 70 },
  { x: 17, y: 68 }, { x: 19, y: 78 }, { x: 22, y: 85 },
];

export const scatterConfidenceData: ScatterDataPoint[] = [
  { x: 1, y: 8 }, { x: 2, y: 15 }, { x: 4, y: 28 },
  { x: 6, y: 42 }, { x: 8, y: 55 }, { x: 10, y: 62 },
  { x: 12, y: 68 }, { x: 14, y: 72 }, { x: 16, y: 78 },
  { x: 18, y: 82 }, { x: 20, y: 85 }, { x: 22, y: 88 },
];

export const observedVsPredictedData: ScatterDataPoint[] = [
  { x: 10, y: 12 }, { x: 20, y: 18 }, { x: 30, y: 28 },
  { x: 40, y: 42 }, { x: 50, y: 48 }, { x: 60, y: 62 },
  { x: 70, y: 68 }, { x: 80, y: 82 }, { x: 90, y: 88 },
  { x: 100, y: 95 },
];

export const classicLineData: LineDataPoint[] = [
  { x: 0, y: 10 }, { x: 2, y: 25 }, { x: 4, y: 45 },
  { x: 6, y: 60 }, { x: 8, y: 72 }, { x: 10, y: 78 },
  { x: 12, y: 82 }, { x: 14, y: 80 }, { x: 16, y: 85 },
  { x: 18, y: 83 }, { x: 20, y: 88 }, { x: 24, y: 90 },
];

export const sigmoidLineData: LineDataPoint[] = [
  { x: 0, y: 5 }, { x: 2, y: 8 }, { x: 4, y: 12 },
  { x: 6, y: 18 }, { x: 8, y: 30 }, { x: 10, y: 50 },
  { x: 12, y: 70 }, { x: 14, y: 82 }, { x: 16, y: 88 },
  { x: 18, y: 92 }, { x: 20, y: 94 }, { x: 24, y: 96 },
];

export const dualAxisLineData: LineDataPoint[] = [
  { x: 0, y: 5, y2: 95 }, { x: 2, y: 10, y2: 88 },
  { x: 4, y: 20, y2: 75 }, { x: 6, y: 35, y2: 60 },
  { x: 8, y: 50, y2: 48 }, { x: 10, y: 65, y2: 35 },
  { x: 12, y: 75, y2: 25 }, { x: 14, y: 82, y2: 18 },
  { x: 16, y: 88, y2: 12 }, { x: 18, y: 92, y2: 8 },
  { x: 20, y: 95, y2: 5 }, { x: 24, y: 97, y2: 3 },
];

export const semiLogLineData: LineDataPoint[] = [
  { x: 0, y: 1 }, { x: 2, y: 5 }, { x: 4, y: 15 },
  { x: 6, y: 40 }, { x: 8, y: 80 }, { x: 10, y: 120 },
  { x: 12, y: 180 }, { x: 14, y: 250 }, { x: 16, y: 320 },
  { x: 18, y: 400 }, { x: 20, y: 480 }, { x: 24, y: 550 },
];

export const contourGridData = (() => {
  const rows = 10;
  const cols = 10;
  const grid: number[][] = [];
  for (let r = 0; r < rows; r++) {
    grid[r] = [];
    for (let c = 0; c < cols; c++) {
      const dx = c - cols / 2 + 0.5;
      const dy = r - rows / 2 + 0.5;
      grid[r][c] = Math.round(Math.exp(-(dx * dx + dy * dy) / 8) * 100) / 100;
    }
  }
  return grid;
})();

export const heatMapData: HeatMapCell[] = (() => {
  const cells: HeatMapCell[] = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 10; c++) {
      cells.push({
        row: r,
        col: c,
        value: Math.round((Math.sin(r * 0.8) * Math.cos(c * 0.6) + 1) * 50),
      });
    }
  }
  return cells;
})();

const spatialRows = ["C01", "C02", "C03", "C04", "C05", "C06", "C07", "C08"];
const spatialCols = ["M01", "M02", "M03", "M04", "M05", "M06", "M07", "M08", "M09", "M10"];

export const spatialHeatMapData: SpatialHeatMapCell[] = (() => {
  const cells: SpatialHeatMapCell[] = [];
  for (const row of spatialRows) {
    for (const col of spatialCols) {
      const ri = spatialRows.indexOf(row);
      const ci = spatialCols.indexOf(col);
      const base = 25 + ri * 2 + ci * 1.5;
      const peak = ri >= 2 && ri <= 5 && ci >= 3 && ci <= 7 ? 20 : 0;
      cells.push({
        row,
        col,
        value: Math.round((base + peak + Math.random() * 5) * 10) / 10,
      });
    }
  }
  return cells;
})();

export { spatialRows, spatialCols };
