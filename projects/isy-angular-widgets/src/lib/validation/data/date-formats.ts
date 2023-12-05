export const ISO_8601_REGEX: RegExp = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d+)?)(Z|[+-]\d{2}:\d{2})$/;

export const INPUT_MASK_REGEX: RegExp = /^([x0-9]{2}\.[x0-9]{2}\.[x0-9]{4})$/;

export const INPUT_UNSPECIFIED_REGEX: RegExp =
  /^(0{2}\.([0-1][1-2]|1[0-2])\.\d{4})$|^(0{2}\.0{2}\.\d{4})$|^(0{2}\.0{2}\.0{4})$|^(x{2}\.([0-1][1-2]|1[0-2])\.\d{4})$|^(x{2}\.x{2}\.\d{4})$|^(x{2}\.x{2}\.x{4})$/;

// date-fns employs single quote symbols for character escaping, such as 'T'.
// This can create conflicts when using ESLint alongside Prettier for code formatting. Consequently, singlequotes are deactivated in the following line.
// eslint-disable-next-line @typescript-eslint/quotes
export const DATE_FORMATS = ['dd.MM.yyyy', 'MM/dd/yyyy', 'yyyy-MM-dd', `yyyy-MM-dd'T'HH:mm:ssX`];

type dateFormats = RegExp[];

export const DATE_FORMATS_REGEX: dateFormats = [
  /^(\d{4}-[01]\d-[0-3]\d)$/, // yyyy-MM-dd
  /^([0-2]\d:[0-5]\d:[0-5]\d)$/, // HH:mm:ss
  /^(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))$/, // yyyy-MM-ddTHH:mm:ssX
  /^(\d{4})-(\d{2})-(\d{2})$/, // yyyy-MM-dd
  /^(\d{2})\.(\d{2})\.(\d{4})$/, // dd.MM.yyyy
  /^(\d{2})-(\d{2})-(\d{4})$/, // MM-dd-yyyy
  /^(\d{2})\/(\d{2})\/(\d{4})$/ // MM/dd/yyyy
];
