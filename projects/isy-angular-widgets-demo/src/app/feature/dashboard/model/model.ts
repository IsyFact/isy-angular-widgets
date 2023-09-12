export interface ChartData {
  labels: string[];
  datasets: ChartDatasetEntry[];
}

export interface ChartDatasetEntry {
  label?: string;
  data: (string | number) [];
  fill?: boolean;
  borderColor?: string;
  tension?: number;
  borderDash?: number[];
  backgroundColor?: string | string[];
}

export interface ChartOptions {
  tooltips?: StackedTooltip;
  responsive: boolean;
  maintainAspectRatio: boolean;
  scales?: Axes;
}

interface StackedTooltip {
  mode: string;
  intersect: boolean;
}

interface Axes {
  x: Axe;
  y: Axe;
}

export interface Axe {
  stacked: boolean;
  ticks: Tick;
  grid: Grid;
}

interface Tick {
  color: string;
}

interface Grid {
  color: string;
}

export interface ChartInitData {
  type: string;
  data?: ChartData;
  options?: ChartOptions;
}
