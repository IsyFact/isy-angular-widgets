import {ChartInitData} from '../model/model';
import {stackedOptions} from './chart-configs';

export const initData: ChartInitData[] = [
  {
    type: 'bar'
  },
  {
    type: 'line'
  },
  {
    type: 'line'
  },
  {
    type: 'bar',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    options: stackedOptions
  }
];
