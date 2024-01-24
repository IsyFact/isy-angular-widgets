type incompleteDateGermanFormats = RegExp[];

export const INCOMPLETE_DATE_GERMAN_FORMATS_REGEX: incompleteDateGermanFormats = [
  /^x{2}\.((x{2}\.(\d{4}|x{4}))|((?!00)\d{2}\.\d{4}))$/,
  /^0{2}\.((0{2}\.(\d{4}|0{4}))|((?!xx)\d{2}\.\d{4}))$/,
  /^\d{2}\.(?!00)\d{2}\.\d{4}$/
];

type incompleteDateFormats = RegExp[];

export const INCOMPLETE_DATE_FORMATS_REGEX: incompleteDateFormats = [
  /^((\d{4}-(?!00)\d{2})|((\d{4}|x{4})-x{2}))-x{2}$/,
  /^((\d{4}-(?!xx)\d{2})|((\d{4}|0{4})-0{2}))-0{2}$/,
  /^\d{4}-(?!00)\d{2}-\d{2}$/
];
