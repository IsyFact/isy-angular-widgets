import {ChartData, ChartDatasetEntry} from '../model/model';
import {blue, orange, pink, yellow} from './menu-colors';

/* eslint-disable @typescript-eslint/no-magic-numbers */

const firstBarDataset: ChartDatasetEntry = {
  label: '2020',
  data: [
    40,
    30,
    30
  ],
  backgroundColor: blue
};

const secondBarDataset: ChartDatasetEntry = {
  label: '2021',
  data: [
    10,
    40,
    50
  ],
  backgroundColor: yellow
};

const thirdBarDataset: ChartDatasetEntry = {
  label: '2022',
  data: [
    10,
    40,
    50
  ],
  backgroundColor: pink
};

const fourthBarDataset: ChartDatasetEntry = {
  label: '2023',
  data: [
    10,
    40,
    50
  ],
  backgroundColor: orange
};

const firstLineDataset: ChartDatasetEntry = {
  label: '2020',
  data: [
    25,
    50,
    25
  ],
  fill: false,
  borderColor: blue,
  tension: .4
};

const secondLineDataset: ChartDatasetEntry = {
  label: '2021',
  data: [
    45,
    45,
    10
  ],
  fill: false,
  borderColor: yellow,
  tension: .4
};

const thirdLineDataset: ChartDatasetEntry = {
  label: '2022',
  data: [
    10,
    10,
    80
  ],
  fill: false,
  borderColor: pink,
  tension: .4
};

const fourthLineDataset: ChartDatasetEntry = {
  label: '2023',
  data: [
    30,
    20,
    50
  ],
  fill: false,
  borderColor: orange,
  tension: .4
};

const firstLineStyleDataset: ChartDatasetEntry = {
  label: '2020',
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
  label: '2021',
  data: [
    15,
    15,
    70
  ],
  fill: false,
  borderColor: yellow,
  tension: .4,
  borderDash: [1, 5]
};

const thirdLineStyleDataset: ChartDatasetEntry = {
  label: '2022',
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

const fourthLineStyleDataset: ChartDatasetEntry = {
  label: '2023',
  data: [
    30,
    40,
    30
  ],
  fill: false,
  borderColor: orange,
  tension: .4,
  borderDash: [1, 5]
};

const firstStackedDataset: ChartDatasetEntry = {
  label: '2020',
  data: [
    40,
    20,
    40
  ],
  backgroundColor: blue
};

const secondStackedDataset: ChartDatasetEntry = {
  label: '2021',
  data: [
    40,
    20,
    40
  ],
  backgroundColor: yellow
};

const thirdStackedDataset: ChartDatasetEntry = {
  label: '2022',
  data: [
    20,
    50,
    30
  ],
  backgroundColor: pink
};

const fourthStackedDataset: ChartDatasetEntry = {
  label: '2023',
  data: [
    65,
    10,
    25
  ],
  backgroundColor: orange
};

export const barChartData: ChartData = {
  labels: [],
  datasets: [
    firstBarDataset,
    secondBarDataset,
    thirdBarDataset,
    fourthBarDataset
  ]
};

export const lineChartData: ChartData = {
  labels: [],
  datasets: [
    firstLineDataset,
    secondLineDataset,
    thirdLineDataset,
    fourthLineDataset
  ]
};

export const lineStyleChartData: ChartData = {
  labels: [],
  datasets: [
    firstLineStyleDataset,
    secondLineStyleDataset,
    thirdLineStyleDataset,
    fourthLineStyleDataset
  ]
};

export const stackedChartData: ChartData = {
  labels: [],
  datasets: [
    firstStackedDataset,
    secondStackedDataset,
    thirdStackedDataset,
    fourthStackedDataset
  ]
};
