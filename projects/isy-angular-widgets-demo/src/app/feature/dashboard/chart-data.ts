import {ChartDatasetEntry} from './model/model';
import {blue, orange, pink, yellow} from './menu-colors';

/* eslint-disable @typescript-eslint/no-magic-numbers */
const labels: string[] = [
  'Beamte',
  'Externe',
  'Behörden'
];

const firstBarDataset: ChartDatasetEntry = {
  label: '2020',
  data: [
    10,
    50,
    40
  ]
};

const secondBarDataset: ChartDatasetEntry = {
  label: '2021',
  data: [
    30,
    40,
    30
  ]
};

const thirdBarDataset: ChartDatasetEntry = {
  label: '2022',
  data: [
    40,
    40,
    20
  ]
};

const fourthBarDataset: ChartDatasetEntry = {
  label: '2023',
  data: [
    50,
    40,
    10
  ]
};

const firstLineDataset: ChartDatasetEntry = {
  label: '2020',
  data: [
    40,
    40,
    20
  ],
  fill: false,
  borderColor: blue,
  tension: .4
};

const secondLineDataset: ChartDatasetEntry = {
  label: '2021',
  data: [
    10,
    65,
    25
  ],
  fill: false,
  borderColor: pink,
  tension: .4
};

const thirdLineDataset: ChartDatasetEntry = {
  label: '2022',
  data: [
    35,
    50,
    15
  ],
  fill: false,
  borderColor: orange,
  tension: .4
};

const fourthLineDataset: ChartDatasetEntry = {
  label: '2023',
  data: [
    45,
    45,
    10
  ],
  fill: false,
  borderColor: yellow,
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
    10,
    65,
    25
  ],
  fill: false,
  borderColor: pink,
  tension: .4,
  borderDash: [1, 5]
};

const thirdLineStyleDataset: ChartDatasetEntry = {
  label: '2022',
  data: [
    35,
    50,
    15
  ],
  fill: false,
  borderColor: orange,
  tension: .4
};

const fourthLineStyleDataset: ChartDatasetEntry = {
  label: '2023',
  data: [
    45,
    35,
    20
  ],
  fill: false,
  borderColor: yellow,
  tension: .4
};

const doughnutDataset: ChartDatasetEntry = {
  label: '2023',
  data: [
    45,
    35,
    20
  ],
  backgroundColor: [
    blue,
    pink,
    orange
  ],
  hoverBackgroundColor: [
    blue,
    pink,
    orange
  ]
};

export const barChartData = {
  labels: labels,
  datasets: [
    firstBarDataset,
    secondBarDataset,
    thirdBarDataset,
    fourthBarDataset
  ]
};

export const lineChartData = {
  labels: labels,
  datasets: [
    firstLineDataset,
    secondLineDataset,
    thirdLineDataset,
    fourthLineDataset
  ]
};


export const lineStyleChartData = {
  labels: labels,
  datasets: [
    firstLineStyleDataset,
    secondLineStyleDataset,
    thirdLineStyleDataset,
    fourthLineStyleDataset
  ]
};

export const doughnutChartData = {
  labels: labels,
  datasets: [
    doughnutDataset
  ]
};


