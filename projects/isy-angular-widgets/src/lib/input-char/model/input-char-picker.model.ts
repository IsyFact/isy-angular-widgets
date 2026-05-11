import {Datentyp} from './datentyp';

export interface InputCharPickerState {
  datentyp: Datentyp;
  triggerElement: HTMLElement;
  width: string;
  height: string;
  header?: string;
  closable: boolean;
  draggable: boolean;
  resizable: boolean;
  dismissableMask: boolean;
  closeOnEscape: boolean;
  modal: boolean;
}

export interface InputCharPickerOpenOptions {
  datentyp: Datentyp;
  triggerElement: HTMLElement;
  onInsert: (zeichen: string) => void;
  width?: string;
  height?: string;
  header?: string;
  closable?: boolean;
  draggable?: boolean;
  resizable?: boolean;
  dismissableMask?: boolean;
  closeOnEscape?: boolean;
  modal?: boolean;
}
