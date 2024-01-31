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

  /**
   * Fire on input init
   * @internal
   */
  ngOnInit(): void {
    this.selection = this.header;
  }

  /**
   * Fire on input changes
   * @internal
   */
  ngOnChanges(): void {
    if (this.allSelected) {
      this.selection = this.header;
    }
  }

  /**
   * Fired on select button click
   * @param identifier Used for the identification of the clicked select button
   */
  onSelection(identifier: string): void {
    this.allSelected = identifier === '';
    this.atSelection.emit({identifier: identifier, zeichen: this.selection});
  }
}
