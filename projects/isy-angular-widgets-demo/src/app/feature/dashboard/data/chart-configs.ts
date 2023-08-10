import {Axe, StackedOptions} from '../model/model';

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

export const stackedOptions: StackedOptions = {
  tooltips: {
    mode: stackedMode,
    intersect: false
  },
  responsive: true,
  scales: {
    x: axe,
    y: axe
  }
};
