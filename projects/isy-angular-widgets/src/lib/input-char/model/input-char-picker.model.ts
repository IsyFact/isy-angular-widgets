import {Datentyp} from './datentyp';
import type {InputCharSelection} from './model';

export interface InputCharPickerState {
  datentyp: Datentyp;
  width: string;
  height: string;
  header?: string;
  closable: boolean;
  draggable: boolean;
  resizable: boolean;
  dismissableMask: boolean;
  closeOnEscape: boolean;
  modal: boolean;
  resetKey: number;
  selection?: InputCharSelection;
  selectedCharacter?: string;
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
