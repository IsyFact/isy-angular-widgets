import {Component, Input} from '@angular/core';
import {Zeichenobjekt} from '../../model/model';

/**
 * Displays a character in sans and serif style.
 * @internal
 */
@Component({
  selector: 'isy-input-char-preview',
  templateUrl: './input-char-preview.component.html',
  styleUrls: ['./input-char-preview.component.scss'],
  standalone: true
})
export class InputCharPreviewComponent {
  @Input() zeichenObjekt?: Zeichenobjekt;
}
