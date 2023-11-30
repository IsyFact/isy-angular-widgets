export const INPUT_MASK_REGEX: RegExp = /^([x0-9]{2}\.[x0-9]{2}\.[x0-9]{4})$/;

export const INPUT_UNSPECIFIED_REGEX: RegExp =
  /^(0{2}\.([0-1][1-2]|1[0-2])\.\d{4})$|^(0{2}\.0{2}\.\d{4})$|^(0{2}\.0{2}\.0{4})$|^(x{2}\.([0-1][1-2]|1[0-2])\.\d{4})$|^(x{2}\.x{2}\.\d{4})$|^(x{2}\.x{2}\.x{4})$/;

export const DATE_FORMATS_LIST = ['dd.MM.yyyy', 'dd-MM-yyyy', 'yyyy-MM-dd', 'MM-dd-yyyy'];
