/**
 * An enum that defines the severity of the message.
 */
export enum TOAST_SEVERITY {
  SUCCESS = 'success',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

/**
 * An enum that defines the type of message.
 */
export enum TOAST_SUMMARY {
  SUCCESS = 'Success',
  INFO = 'Info',
  WARN = 'Warn',
  ERROR = 'Error'
}

/**
 * An enum that defines the content of the message to display.
 */
export enum TOAST_MESSAGE {
  SUCCESS = 'Daten erfolgreich Fake gespeichert!',
  INFO = 'Die ist ein Informationstext',
  WARN = 'Die ist ein Warnungstext',
  ERROR = 'Dies ist ein Fehlertext',
  ERROR_LOADING_ITEMS = 'Daten konnten geladen werden!'
}
