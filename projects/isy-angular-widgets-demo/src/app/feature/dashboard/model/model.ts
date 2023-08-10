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

export interface StackedOptions {
  tooltips: StackedTooltip;
  responsive: boolean;
  scales: Axes;
}

export interface StackedTooltip {
  mode: string;
  intersect: boolean;
}

export interface Axes {
  x: Axe;
  y: Axe;
}

export interface Axe {
  stacked: boolean;
  ticks: Tick;
  grid: Grid;
}

export interface Tick {
  color: string;
}

export interface Grid {
  color: string;
}

export interface ChartInitData {
  type: string;
  data?: ChartData;
  options?: StackedOptions;
}
