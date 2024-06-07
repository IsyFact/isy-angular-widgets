/**
 * An interface that defines a column in the result table.
 */
export interface ResultColumn {
  field: string;
  header: string;
  type: string;
  currency?: {currencyCode: string; display: string};
}

/**
 * An interface that defines a result filter.
 */
export interface ResultFilter {
  label: string;
  value: string;
}
