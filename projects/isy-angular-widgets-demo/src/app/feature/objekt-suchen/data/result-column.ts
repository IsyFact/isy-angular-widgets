import {ResultColumn, ResultState} from '../model/result-column';

/**
 * Represents the result columns for a table.
 */
export const resultColumn: ResultColumn[] = [
  {
    field: 'gender',
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

export const state: ResultState[] = [
  {label: 'Unqualifiziert', value: 'Unqualifiziert'},
  {label: 'Qualifiziert', value: 'Qualifiziert'},
  {label: 'Neu', value: 'Neu'},
  {label: 'Verhandlung', value: 'Verhandlung'},
  {label: 'Erneuerung', value: 'Erneuerung'},
  {label: 'Vorschlag', value: 'Vorschlag'}
];

export const gender = [{gender: 'x'}, {gender: 'y'}, {gender: 'z'}];
