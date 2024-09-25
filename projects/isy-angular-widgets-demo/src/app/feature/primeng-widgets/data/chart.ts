/* eslint-disable @typescript-eslint/no-magic-numbers */

import {ChartData} from '../../dashboard/model/model';
import {ChartOption} from '../model/chart';

const orange700 = 'rgba(255, 159, 64, 0.7)';
const green700 = 'rgba(75, 192, 192, 0.7)';
const blue700 = 'rgba(54, 162, 235, 0.7)';
const purple700 = 'rgba(153, 102, 255, 0.7)';

const orange = 'rgb(255, 159, 64)';
const green = 'rgb(75, 192, 192)';
const blue = 'rgb(54, 162, 235)';
const purple = 'rgb(153, 102, 255)';

const documentStyle = getComputedStyle(document.documentElement);
const textColor = documentStyle.getPropertyValue('--text-color');
const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

export const barChartData: ChartData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  datasets: [
    {
      label: 'First dataset',
      backgroundColor: blue700,
      borderColor: blue,
      data: [65, 59, 80, 81, 56, 55]
    },
    {
      label: 'Second dataset',
      backgroundColor: purple700,
      borderColor: purple,
      data: [28, 48, 40, 19, 86, 27]
    }
  ]
};

export const verticalBarChartOptions: ChartOption = {
  maintainAspectRatio: false,
  aspectRatio: 0.8,
  plugins: {
    legend: {
      labels: {
        color: textColor
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        color: textColorSecondary
      },
      grid: {
        color: surfaceBorder,
        drawBorder: false
      }
    },
    x: {
      ticks: {
        color: textColorSecondary,
        font: {
          weight: 500
        }
      },
      grid: {
        color: surfaceBorder,
        drawBorder: false
      }
    }
  }
};

export const horizontalBarChartOptions: ChartOption = {
  indexAxis: 'y',
  maintainAspectRatio: false,
  aspectRatio: 0.8,
  plugins: {
    legend: {
      labels: {
        color: textColor
      }
    }
  },
  scales: {
    x: {
      ticks: {
        color: textColorSecondary,
        font: {
          weight: 500
        }
      },
      grid: {
        color: surfaceBorder,
        drawBorder: false
      }
    },
    y: {
      ticks: {
        color: textColorSecondary
      },
      grid: {
        color: surfaceBorder,
        drawBorder: false
      }
    }
  }
};

export const stackedOptions: ChartOption = {
  maintainAspectRatio: false,
  aspectRatio: 0.8,
  plugins: {
    tooltip: {
      mode: 'index',
      intersect: false
    },
    legend: {
      labels: {
        color: textColor
      }
    }
  },
  scales: {
    x: {
      stacked: true,
      ticks: {
        color: textColorSecondary
      },
      grid: {
        color: surfaceBorder,
        drawBorder: false
      }
    },
    y: {
      stacked: true,
      ticks: {
        color: textColorSecondary
      },
      grid: {
        color: surfaceBorder,
        drawBorder: false
      }
    }
  }
};

export const circledChartData: ChartData = {
  labels: ['A', 'B', 'C', 'D'],
  datasets: [
    {
      data: [540, 325, 702, 421],
      backgroundColor: [blue, orange, green, purple],
      hoverBackgroundColor: [blue700, orange700, green700, purple700]
    }
  ]
};

export const pieChartOptions: ChartOption = {
  plugins: {
    legend: {
      labels: {
        usePointStyle: true,
        color: textColor
      }
    }
  }
};

export const doughnutChartOptions: ChartOption = {
  cutout: '60%',
  plugins: {
    legend: {
      labels: {
        color: textColor
      }
    }
  }
};

export const polarAreaChartOptions: ChartOption = {
  plugins: {
    legend: {
      labels: {
        color: textColor
      }
    }
  },
  scales: {
    r: {
      grid: {
        color: surfaceBorder
      }
    }
  }
};

export const lineChartData: ChartData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'First Dataset',
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: false,
      borderColor: orange,
      tension: 0.4
    },
    {
      label: 'Second Dataset',
      data: [28, 48, 40, 19, 86, 27, 90],
      fill: false,
      borderColor: green,
      tension: 0.4
    }
  ]
};

export const lineChartOptions: ChartOption = {
  maintainAspectRatio: false,
  aspectRatio: 0.6,
  plugins: {
    legend: {
      labels: {
        color: textColor
      }
    }
  },
  scales: {
    x: {
      ticks: {
        color: textColorSecondary
      },
      grid: {
        color: surfaceBorder,
        drawBorder: false
      }
    },
    y: {
      ticks: {
        color: textColorSecondary
      },
      grid: {
        color: surfaceBorder,
        drawBorder: false
      }
    }
  }
};

export const radarChartData: ChartData = {
  labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
  datasets: [
    {
      label: 'First dataset',
      borderColor: orange,
      pointBackgroundColor: orange,
      pointBorderColor: orange,
      pointHoverBackgroundColor: textColor,
      pointHoverBorderColor: orange,
      data: [65, 59, 90, 81, 56, 55, 40]
    },
    {
      label: 'Second dataset',
      borderColor: green,
      pointBackgroundColor: green,
      pointBorderColor: green,
      pointHoverBackgroundColor: textColor,
      pointHoverBorderColor: green,
      data: [28, 48, 40, 19, 96, 27, 100]
    }
  ]
};

export const radarChartOptions: ChartOption = {
  plugins: {
    legend: {
      labels: {
        color: textColor
      }
    }
  },
  scales: {
    r: {
      grid: {
        color: textColorSecondary
      },
      pointLabels: {
        color: textColorSecondary
      }
    }
  }
};
