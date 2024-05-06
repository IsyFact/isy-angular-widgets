export const INPUT_MASK_REGEX: RegExp = /^([x0-9]{2}\.[x0-9]{2}\.[x0-9]{4})$/;

export const INPUT_MASK_REGEX_ISO_DATE: RegExp = /^([x0-9]{4}-[x0-9]{2}-[x0-9]{2})$/;

// Multiple regex combined to one (SonarQube error)
export const INPUT_UNSPECIFIED_REGEX = new RegExp(
  /* 00.12.1234 */
  /^(0{2}\.(0[1-9]|1[0-2])\.\d{4})/.source +
    '$|' +
    /* 00.00.1234 */
    /^(0{2}\.0{2}\.\d{4})/.source +
    '$|' +
    /* 00.00.0000 */
    /^(0{2}\.0{2}\.0{4})/.source +
    '$|' +
    /* xx.12.1234 */
    /^(x{2}\.(0[1-9]|1[0-2])\.\d{4})/.source +
    '$|' +
    /* xx.xx.1234 */
    /^(x{2}\.x{2}\.\d{4})/.source +
    '$|' +
    /* xx.xx.xxxx */
    /^(x{2}\.x{2}\.x{4})$/.source
);
export const INPUT_UNSPECIFIED_REGEX_ISO_DATE = new RegExp(
  /* 1234-12-00 */
  /^(\d{4}-(0[1-9]|1[0-2])-0{2})/.source +
    '$|' +
    /* 1234-00-00 */
    /^(\d{4}-0{2}-0{2})/.source +
    '$|' +
    /* 0000-00-00 */
    /^(0{4}-0{2}-0{2})/.source +
    '$|' +
    /* 1234-12-xx */
    /^(\d{4}-(0[1-9]|1[0-2])-x{2})/.source +
    '$|' +
    /* 1234-xx-xx */
    /^(\d{4}-x{2}-x{2})/.source +
    '$|' +
    /* xxxx-xx-xx */
    /^(x{4}-x{2}-x{2})$/.source
);
