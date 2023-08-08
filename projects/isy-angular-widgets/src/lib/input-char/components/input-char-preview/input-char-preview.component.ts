import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Zeichenobjekt} from '../../model/model';
import {WidgetsConfigService} from '../../../i18n/widgets-config.service';

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
  @Input() zeichenObjekt!: Zeichenobjekt;

  @Output() zeichenObjektChange = new EventEmitter<Zeichenobjekt>();

  constructor(
    private widgetsConfigService: WidgetsConfigService
  ) {}

  selectZeichen(zeichenObjekt: Zeichenobjekt): void {
    this.zeichenObjektChange.emit(zeichenObjekt);
  }

  /**
   * Get translated text
   * @param path to the translated text
   * @returns translated text
   */
  getTranslation(path: string): any {
    return this.widgetsConfigService.getTranslation(path);
  }
}
