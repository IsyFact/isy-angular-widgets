export const INCOMPLETE_DATE_GERMAN_FORMAT_REGEX: RegExp =
  /^(x{2}\.((?!00)\d{2}|x{2})\.(\d{4}|x{4}))$|^(0{2}\.((?!xx)\d{2}|0{2})\.(\d{4}|0{4}))$|^(\d{2}\.\d{2}\.\d{4})$/;

export const INCOMPLETE_DATE_REGEX: RegExp =
  /^(\d{4}|x{4})\-((?!00)\d{2}|x{2})\-(x{2})$|^((\d{4}|0{4})\-((?!xx)\d{2}|0{2})\-0{2})$|^(\d{4}\-\d{2}\-\d{2})$/;
