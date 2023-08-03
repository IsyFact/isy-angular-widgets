import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Zeichenobjekt} from '../../model/model';

/**
 * Displays a character in sans and serif style.
 * @internal
 */
@Component({
  selector: 'isy-input-char-preview',
  templateUrl: './input-char-preview.component.html',
  styleUrls: ['./input-char-preview.component.scss']
})
export class InputCharPreviewComponent {
  @Input() zeichenObjekt?: Zeichenobjekt;

  @Output() insertCharacter = new EventEmitter<Zeichenobjekt>();

  selectZeichen(zeichenObjekt: Zeichenobjekt): void {
    this.insertCharacter.emit(zeichenObjekt);
  }
}
