import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {Zeichenobjekt} from '../../model/model';

/**
 * Displays a character in sans and serif style.
 * @internal
 */
@Component({
  selector: 'isy-input-char-preview',
  templateUrl: './input-char-preview.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./input-char-preview.component.scss']
})
export class InputCharPreviewComponent {
  @Input() zeichenObjekt?: Zeichenobjekt;
}
