import {ChartDatasetEntry} from '../model/model';
import {blue, orange, pink} from './menu-colors';

/* eslint-disable @typescript-eslint/no-magic-numbers */
const labels: string[] = [
  'Beamte',
  'Externe',
  'Behörden'
];

const firstBarDataset: ChartDatasetEntry = {
  label: '2022',
  data: [
    40,
    30,
    30
  ]
};

const secondBarDataset: ChartDatasetEntry = {
  label: '2023',
  data: [
    10,
    40,
    50
  ]
};

const firstLineDataset: ChartDatasetEntry = {
  label: '2022',
  data: [
    25,
    50,
    25
  ],
  fill: false,
  borderColor: orange,
  tension: .4
};

const secondLineDataset: ChartDatasetEntry = {
  label: '2023',
  data: [
    45,
    45,
    10
  ],
  fill: false,
  borderColor: blue,
  tension: .4
};

const firstLineStyleDataset: ChartDatasetEntry = {
  label: '2022',
  data: [
    40,
    40,
    20
  ],
  fill: false,
  borderColor: blue,
  tension: .4,
  borderDash: [5, 5]
};

const secondLineStyleDataset: ChartDatasetEntry = {
  label: '2023',
  data: [
    10,
    65,
    25
  ],
  fill: false,
  borderColor: pink,
  tension: .4,
  borderDash: [1, 5]
};

const firstStackedDataset: ChartDatasetEntry = {
  label: '2022',
  data: [
    40,
    20,
    40
  ],
  backgroundColor: orange
};

const secondStackedDataset: ChartDatasetEntry = {
  label: '2023',
  data: [
    20,
    50,
    30
  ],
  backgroundColor: blue
};

export const barChartData = {
  labels: labels,
  datasets: [
    firstBarDataset,
    secondBarDataset
  ]
};

export const lineChartData = {
  labels: labels,
  datasets: [
    firstLineDataset,
    secondLineDataset
  ]
};

export const lineStyleChartData = {
  labels: labels,
  datasets: [
    firstLineStyleDataset,
    secondLineStyleDataset
  ]
};

export const stackedChartData = {
  labels: labels,
  datasets: [
    firstStackedDataset,
    secondStackedDataset
  ]
};
