export interface ChartData {
  labels: string[];
  datasets: ChartDatasetEntry[];
}

export interface ChartDatasetEntry {
  label?: string;
  data: (string | number)[];
  fill?: boolean;
  borderColor?: string | string[];
  tension?: number;
  borderDash?: string[];
  backgroundColor?: string | string[];
  borderWidth?: number;
  hoverBackgroundColor?: string | string[];
  pointBackgroundColor?: string;
  pointBorderColor?: string;
  pointHoverBackgroundColor?: string;
  pointHoverBorderColor?: string;
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
  type: 'bar' | 'line' | 'pie' | 'doughnut' | 'polarArea' | 'radar' | 'bubble' | 'scatter';
  data?: ChartData;
  options?: ChartOptions;
}
