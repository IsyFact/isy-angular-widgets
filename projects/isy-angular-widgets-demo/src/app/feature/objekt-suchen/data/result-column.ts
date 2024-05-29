import {ResultColumn, ResultState} from '../model/result-column';

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

export const state: ResultState[] = [
  {label: 'isyAngularWidgetsDemo.labels.unqualified', value: 'isyAngularWidgetsDemo.labels.unqualified'},
  {label: 'isyAngularWidgetsDemo.labels.qualified', value: 'isyAngularWidgetsDemo.labels.qualified'},
  {label: 'isyAngularWidgetsDemo.labels.new', value: 'isyAngularWidgetsDemo.labels.new'},
  {label: 'isyAngularWidgetsDemo.labels.negotiation', value: 'isyAngularWidgetsDemo.labels.negotiation'},
  {label: 'isyAngularWidgetsDemo.labels.renewal', value: 'isyAngularWidgetsDemo.labels.renewal'},
  {label: 'isyAngularWidgetsDemo.labels.proposal', value: 'isyAngularWidgetsDemo.labels.proposal'}
];

export const gender = [
  {gender: 'isyAngularWidgetsDemo.labels.female'},
  {gender: 'isyAngularWidgetsDemo.labels.male'},
  {gender: 'isyAngularWidgetsDemo.labels.divers'}
];
