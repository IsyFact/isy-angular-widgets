import {ChartInitData} from '../model/model';
import {responsiveOptions, stackedOptions} from './chart-configs';

export const initData: ChartInitData[] = [
  {
    type: 'bar',
    options: responsiveOptions
  },
  {
    type: 'line',
    options: responsiveOptions
  },
  {
    type: 'line',
    options: responsiveOptions
  },
  {
    type: 'bar',
    options: stackedOptions
  }
];
