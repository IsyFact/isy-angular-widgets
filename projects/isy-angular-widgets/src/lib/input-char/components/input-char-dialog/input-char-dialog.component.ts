import {Component, ContentChildren, EventEmitter, Input, Output, QueryList} from '@angular/core';
import {InputCharDialogDirective} from '../../directives/input-char-dialog.directive';

/**
 * @internal
 */
@Component({
  selector: 'isy-input-char-dialog',
  templateUrl: './input-char-dialog.component.html',
  styleUrls: ['./input-char-dialog.component.scss']
})
export class InputCharDialogComponent {
  @ContentChildren(InputCharDialogDirective) content!: QueryList<InputCharDialogDirective>;

  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() header?: string;

  /* eslint-disable-next-line @typescript-eslint/no-magic-numbers */
  @Input() width = 775;

  /* eslint-disable-next-line @typescript-eslint/no-magic-numbers */
  @Input() height = 460;

  @Input() closable = true;

  @Input() draggable = true;

  @Input() resizable = false;

  @Input() closeOnClickOutside = false;

  @Input() closeOnEscape = true;

  @Input() modal = false;

  /**
   * The inner dialog can be closed by using the dialog X. In that case, the parent component needs to be notified explicitly
   * as no event is thrown through two-way-binding.
   * The method is not called when visibility changes from outside via display input.
   * @param visible The new visibility state of the inner dialog; should always be false as the dialog can not open by itself.
   * @internal
   */
  onInnerDialogVisibilityChange(visible: boolean): void {
    this.visibleChange.emit(visible);
  }
}
