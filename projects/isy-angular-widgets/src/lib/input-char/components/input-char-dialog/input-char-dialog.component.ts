import {Component, ContentChildren, EventEmitter, Input, Output, QueryList} from '@angular/core';
import {InputCharDialogDirective} from '../../directives/input-char-dialog.directive';

/**
 * @ignore
 */
@Component({
  selector: 'isy-input-char-dialog',
  templateUrl: './input-char-dialog.component.html',
  styleUrls: ['./input-char-dialog.component.scss']
})
export class InputCharDialogComponent {
  @ContentChildren(InputCharDialogDirective) content!: QueryList<InputCharDialogDirective>;

  @Output() displayChange = new EventEmitter<boolean>();

  @Input() display: boolean = false;

  @Input() header!: string;

  /* eslint-disable-next-line @typescript-eslint/no-magic-numbers */
  @Input() width: number = 775;

  /* eslint-disable-next-line @typescript-eslint/no-magic-numbers */
  @Input() height: number = 460;

  @Input() closable!: boolean;

  @Input() draggable!: boolean;

  @Input() resizable!: boolean;

  @Input() closeOnClickOutside!: boolean;

  @Input() closeOnEscape!: boolean;

  @Input() modal!: boolean;

  onClose(close: boolean): void {
    this.displayChange.emit(close);
  }
}
