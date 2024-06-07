import {ResultColumn, ResultFilter} from '../model/result-column';

/**
 * Represents the result columns for a table.
 */
export const resultColumn: ResultColumn[] = [
  {
    field: 'gender',
    header: 'isyAngularWidgetsDemo.labels.gender',
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

/**
 * Represents the state options for a result filter.
 */
export const state: ResultFilter[] = [
  {label: 'isyAngularWidgetsDemo.labels.unqualified', value: 'isyAngularWidgetsDemo.labels.unqualified'},
  {label: 'isyAngularWidgetsDemo.labels.qualified', value: 'isyAngularWidgetsDemo.labels.qualified'},
  {label: 'isyAngularWidgetsDemo.labels.new', value: 'isyAngularWidgetsDemo.labels.new'},
  {label: 'isyAngularWidgetsDemo.labels.negotiation', value: 'isyAngularWidgetsDemo.labels.negotiation'},
  {label: 'isyAngularWidgetsDemo.labels.renewal', value: 'isyAngularWidgetsDemo.labels.renewal'},
  {label: 'isyAngularWidgetsDemo.labels.proposal', value: 'isyAngularWidgetsDemo.labels.proposal'}
];

/**
 * Represents the gender options for a result filter.
 */
export const gender: ResultFilter[] = [
  {label: 'isyAngularWidgetsDemo.labels.female', value: 'isyAngularWidgetsDemo.labels.female'},
  {label: 'isyAngularWidgetsDemo.labels.male', value: 'isyAngularWidgetsDemo.labels.male'},
  {label: 'isyAngularWidgetsDemo.labels.divers', value: 'isyAngularWidgetsDemo.labels.divers'}
];
