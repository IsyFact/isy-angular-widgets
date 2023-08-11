import {Axe, ChartOptions} from '../model/model';

const ticksColor = '#666666';
const gridColor = '#E5E5E5';
const stackedMode = 'index';

const axe: Axe = {
  stacked: true,
  ticks: {
    color: ticksColor
  },
  grid: {
    color: gridColor
  }
};

export const stackedOptions: ChartOptions = {
  tooltips: {
    mode: stackedMode,
    intersect: false
  },
  responsive: false,
  maintainAspectRatio: false,
  scales: {
    x: axe,
    y: axe
  }
};

export const responsiveOptions: ChartOptions = {
  responsive: false,
  maintainAspectRatio: false
};
