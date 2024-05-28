import {ResultColumn} from '../model/result-column';

/**
 * Represents the result columns for a table.
 */
export const resultColumn: ResultColumn[] = [
  {
    field: 'geschlecht',
    header: 'isyAngularWidgetsDemo.labels.geschlecht',
    type: 'text'
  },
  {
    field: 'staatsangehoerigkeit',
    header: 'isyAngularWidgetsDemo.labels.staatsangehoerigkeit',
    type: 'text'
  },
  {
    field: 'geburtsdatum',
    header: 'isyAngularWidgetsDemo.labels.geburtsdatum',
    type: 'date'
  },
  {
    field: 'bilanz',
    header: 'isyAngularWidgetsDemo.labels.bilanz',
    type: 'numeric',
    currency: {currencyCode: 'EUR', display: 'symbol'}
  }
];
