import {Component, ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild} from '@angular/core';
import {Datentyp} from '../../model/datentyp';
import {CharacterService} from '../../services/character.service';
import {Zeichenobjekt} from '../../model/model';
import {WidgetsConfigService} from '../../../i18n/widgets-config.service';
import {InputCharDialogComponent} from '../input-char-dialog/input-char-dialog.component';
import {DialogModule} from 'primeng/dialog';
import {ButtonModule} from 'primeng/button';

@Component({
  selector: 'isy-input-char',
  templateUrl: './input-char.component.html',
  styleUrls: ['./input-char.component.scss'],
  standalone: true,
  providers: [CharacterService],
  imports: [InputCharDialogComponent, DialogModule, ButtonModule]
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

  constructor(
    private readonly charService: CharacterService,
    public configService: WidgetsConfigService
  ) {}

  ngOnChanges(): void {
    this.allCharacters = this.charService.getCharactersByDataType(this.datentyp);
  }

  /**
   * Toggles the character picker
   */
  toggleCharPicker(): void {
    this.visible = !this.visible;
  }

  onDialogClose(): void {
    this.visible = false;
    this.openDialogButton.nativeElement.focus();
  }
}
