import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {InputCharData, ZeichenSelection} from '../../model/model';

@Component({
  selector: 'isy-multi-select-button',
  templateUrl: './multi-select-button.component.html',
  styleUrl: './multi-select-button.component.scss'
})
export class MultiSelectButtonComponent implements OnInit, OnChanges {
  /**
   * Fired on select button selection
   * @internal
   */
  @Output() atSelection = new EventEmitter<ZeichenSelection>();

  /**
   * Header title of select all button
   * @internal
   */
  @Input() allButtonOptions: string = '';

  /**
   * The array who stores an array with every data who must be displayed.
   * @internal
   */
  @Input() dataToDisplay: InputCharData = {};

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
    this.selection = this.allButtonOptions;
  }

  /**
   * Fire on input changes
   * @internal
   */
  ngOnChanges(): void {
    if (this.allSelected) {
      this.selection = this.allButtonOptions;
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
