import {
  afterNextRender,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Injector,
  Input,
  OnChanges,
  Output,
  ViewChild
} from '@angular/core';
import {Datentyp} from '../../model/datentyp';
import {CharacterService} from '../../services/character.service';
import {Zeichenobjekt} from '../../model/model';
import {WidgetsConfigService} from '../../../i18n/widgets-config.service';
import {InputCharDialogComponent} from '../input-char-dialog/input-char-dialog.component';
import {DialogModule} from 'primeng/dialog';
import {ButtonModule} from 'primeng/button';

@Component({
  standalone: true,
  selector: 'isy-input-char',
  templateUrl: './input-char.component.html',
  styleUrls: ['./input-char.component.scss'],
  imports: [InputCharDialogComponent, DialogModule, ButtonModule],
  providers: [CharacterService]
})
export class InputCharComponent implements OnChanges {
  /**
   * The width of the dialog.
   */
  @Input() width = '740px';

  /**
   * The height of the dialog.
   */
  @Input() height = '460px';

  /**
   * The current value
   */
  @Output() insertCharacter = new EventEmitter<string>();

  /**
   * Determines which set of characters (datatype) according to DIN 91379 to show
   */
  @Input() datentyp: Datentyp = Datentyp.DATENTYP_C;

  /**
   * A title to show
   */
  @Input() header?: string;

  /**
   * Determines whether the button is outlined
   */
  @Input() outlinedInputCharButton: boolean = false;

  /**
   * Determines whether the char picker can be closed
   */
  @Input() closable: boolean = true;

  /**
   * Determines whether the char picker can be repositioned manually
   */
  @Input() draggable: boolean = true;

  /**
   * Determines whether the char picker can be resized manually
   */
  @Input() resizable: boolean = false;

  /**
   * Determines whether the picker closes when clicking outside of it
   */
  @Input() dismissableMask: boolean = false;

  /**
   * Determines whether the picker closes when pressing the ESC key
   */
  @Input() closeOnEscape: boolean = true;

  /**
   * Determines whether the picker is displayed as a modal
   */
  @Input() modal: boolean = false;

  /**
   * Determines whether the input is displayed
   */
  @Input() isInputDisabled: boolean = false;

  @ViewChild('openDialogButton') openDialogButton!: ElementRef<HTMLButtonElement>;

  /**
   * Controls the char picker visibility
   * @internal
   */
  visible: boolean = false;

  /**
   * All characters available in the selected data type.
   * @internal
   */
  allCharacters: Zeichenobjekt[] = [];

  private readonly charService = inject(CharacterService);

  private readonly lastTrigger?: HTMLElement;

  /**
   * A service used to translate labels within the widgets library.
   */
  configService = inject(WidgetsConfigService);

  ngOnChanges(): void {
    this.allCharacters = this.charService.getCharactersByDataType(this.datentyp);
  }

  private readonly injector = inject(Injector);

  toggleCharPicker(): void {
    this.visible = !this.visible;
  }

  onDialogClose(): void {
    const button = this.openDialogButton?.nativeElement;

    if (!button || !button.isConnected || button.disabled) {
      return;
    }

    afterNextRender({write: () => button.focus()}, {injector: this.injector});
  }
}
