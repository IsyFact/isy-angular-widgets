/**
 * An interface that defines a column in the result table.
 */
export interface ResultColumn {
  field: string;
  header: string;
  type: string;
  currency?: {currencyCode: string; display: string};
}

export interface ResultState {
  label: string;
  value: string;
}
