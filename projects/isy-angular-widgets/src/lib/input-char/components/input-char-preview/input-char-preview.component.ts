import {ChangeDetectionStrategy, Component, Input, inject} from '@angular/core';
import {Zeichenobjekt} from '../../model/model';
import {WidgetsConfigService} from '../../../i18n/widgets-config.service';

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
  private readonly configService = inject(WidgetsConfigService);

  @Input() zeichenObjekt?: Zeichenobjekt;

  get lettersPreviewAriaLabel(): string {
    const label = this.configService.getTranslation('inputChar.preview.letters');
    return this.zeichenObjekt ? `${label}: ${this.zeichenObjekt.zeichen}` : label;
  }

  get letterInformationPreviewAriaLabel(): string {
    const label = this.configService.getTranslation('inputChar.preview.information');
    return this.zeichenObjekt
      ? `${label}: ${this.zeichenObjekt.name}, Codepoint: ${this.zeichenObjekt.codepoint}`
      : label;
  }
}
