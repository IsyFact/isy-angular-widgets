export interface ChartData {
  labels: string[];
  datasets: ChartDatasetEntry[];
}

export interface ChartDatasetEntry {
  label: string;
  data: (string | number) [];
  fill?: boolean;
  borderColor?: string;
  tension?: number;
  borderDash?: number[];
  borderWidth?: number;
  backgroundColor?: string[];
  hoverBackgroundColor?: string[];
}
