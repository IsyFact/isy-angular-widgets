import {ResultColumn} from '../model/result-column';

/**
 * Represents the result columns for a table.
 */
export const resultColumn: ResultColumn[] = [
  {
    field: 'geschlecht',
    header: 'Geschlecht',
    type: 'text'
  },
  {
    field: 'staatsangehoerigkeit',
    header: 'Nationalität',
    type: 'text'
  },
  {
    field: 'geburtsdatum',
    header: 'Geburtsdatum',
    type: 'date'
  },
  {
    field: 'bilanz',
    header: 'Bilanz',
    type: 'numeric',
    currency: {currencyCode: 'EUR', display: 'symbol'}
  }
];
