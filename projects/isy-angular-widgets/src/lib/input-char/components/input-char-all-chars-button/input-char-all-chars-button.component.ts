import {Component, EventEmitter, Output} from '@angular/core';

/**
 * @internal
 */
@Component({
  selector: 'isy-input-char-all-chars-button',
  templateUrl: './input-char-all-chars-button.component.html',
  styleUrls: ['./input-char-all-chars-button.component.scss']
})
export class InputCharAllCharsButtonComponent {
  @Output() allSelected = new EventEmitter<void>();

  allCharsValue: string = 'Alle';

  options: string [] = [this.allCharsValue];

  onAllSelection(): void {
    this.allSelected.emit();
  }

  reset(): void {
    this.allCharsValue = '';
  }
}
