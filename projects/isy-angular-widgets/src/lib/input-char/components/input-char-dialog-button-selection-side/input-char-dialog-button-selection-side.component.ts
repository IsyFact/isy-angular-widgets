import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {InputCharData, ZeichenSelection} from '../../model/model';

@Component({
  selector: 'isy-input-char-dialog-button-selection-side',
  templateUrl: './input-char-dialog-button-selection-side.component.html',
  styleUrl: './input-char-dialog-button-selection-side.component.scss'
})
export class InputCharDialogButtonSelectionSideComponent implements OnInit, OnChanges {
  /**
   * Fired on select button selection
   * @internal
   */
  @Output() atSelection = new EventEmitter<ZeichenSelection>();

  /**
   * Header title of select all button
   * @internal
   */
  @Input() header!: string;

  /**
   * The array who stores an array with every data who must be displayed.
   * @internal
   */
  @Input() data!: InputCharData[];

  /**
   * Current select button value
   * @internal
   */
  selection: string = '';

  /**
   * The boolean that decides whether the all select button is selected
   * @internal
   */
  allSelected: boolean = true;

  ngOnInit(): void {
    this.selection = this.header;
  }

  ngOnChanges(): void {
    if (this.allSelected) {
      this.selection = this.header;
    }
  }

  onSelection(key: string): void {
    this.allSelected = key === '';
    this.atSelection.emit({identifier: key, zeichen: this.selection});
  }
}
