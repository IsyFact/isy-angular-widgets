/**
 * An interface to define axis
 */
export interface Axe {
  beginAtZero?: boolean;
  stacked?: boolean;
  ticks: {
    color: string;
    font?: {
      weight: number;
    };
  };
  grid: {
    color: string;
    drawBorder: boolean;
  };
}

/**
 * An interface to define chart plugins
 */
export interface Plugins {
  legend: {
    labels: {
      color: string;
      usePointStyle?: boolean;
    };
  };
  tooltip?: {
    mode: string;
    intersect: boolean;
  };
}

/**
 * An interface to define chart options
 */
export interface ChartOption {
  indexAxis?: 'x' | 'y';
  maintainAspectRatio?: boolean;
  aspectRatio?: number;
  cutout?: string;
  plugins: Plugins;
  scales?: {
    y?: Axe;
    x?: Axe;
    r?: {
      grid: {
        color: string;
      };
      pointLabels?: {
        color: string;
      };
    };
  };
}
