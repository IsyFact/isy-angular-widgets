import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SchriftZeichen} from '../../model/model';

/**
 * @internal
 */
@Component({
  selector: 'isy-input-char-select-button',
  templateUrl: './input-char-select-button.component.html',
  styleUrls: ['./input-char-select-button.component.scss']
})
export class InputCharSelectButtonComponent {
  @Output() selection = new EventEmitter<string>();

  @Input() options!: SchriftZeichen[] | string[];

  @Input() multiple: boolean = false;

  @Input() optionLabel: string = '';

  @Input() optionValue: string = '';

  selectedValue!: string;

  onSelection(selection: string): void {
    this.selection.emit(selection);
  }

  reset(): void {
    this.selectedValue = '';
  }
}
