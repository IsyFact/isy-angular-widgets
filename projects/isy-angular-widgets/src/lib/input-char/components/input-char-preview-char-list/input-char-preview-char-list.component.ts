import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Zeichenobjekt} from '../../model/model';

/**
 * @internal
 */
@Component({
  selector: 'isy-input-char-preview-char-list',
  templateUrl: './input-char-preview-char-list.component.html',
  styleUrls: ['./input-char-preview-char-list.component.scss']
})
export class InputCharPreviewCharListComponent {
  @Output() charSelection = new EventEmitter<Zeichenobjekt>();

  @Input() options!: Zeichenobjekt[];

  selectedValue!: Zeichenobjekt;

  onSelection(zeichenObjekt: Zeichenobjekt): void {
    this.selectedValue = zeichenObjekt;
    this.charSelection.emit(zeichenObjekt);
  }

  reset(): void {
    this.onSelection(this.options[0]);
  }
}
