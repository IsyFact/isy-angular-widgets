import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Schriftzeichengruppe, Zeichenobjekt} from '../../model/model';
import {WidgetsConfigService} from '../../../i18n/widgets-config.service';

/**
 * @internal
 */
@Component({
  selector: 'isy-input-char-dialog',
  templateUrl: './input-char-dialog.component.html',
  styleUrls: ['./input-char-dialog.component.scss']
})
export class InputCharDialogComponent implements OnInit, OnChanges {

  /**
   * Specifies the visibility of the dialog.
   */
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  /**
   * Emits a character chosen to insert by the user.
   */
  @Output() insertCharacter = new EventEmitter<string>();

  /**
   * Title text of the dialog.
   */
  @Input() header: string = 'Special Character Picker';

  /**
   * The width of the dialog.
   */
  @Input() width = '775px';

  /**
   * The height of the dialog.
   */
  @Input() height = '460px';

  /**
   * Adds a close icon to the header to hide the dialog.
   */
  @Input() closable = true;

  /**
   * Enables dragging to change the position using header.
   */
  @Input() draggable = true;

  /**
   * Enables resizing of the content.
   */
  @Input() resizable = false;

  /**
   * Specifies if clicking the modal background should hide the dialog.
   */
  @Input() dismissableMask = false;

  /**
   * Specifies if pressing escape key should hide the dialog.
   */
  @Input() closeOnEscape = true;

  /**
   * Defines if background should be blocked when dialog is displayed.
   */
  @Input() modal = false;

  /**
   * All characters the dialog should display.
   */
  @Input() allCharacters: Zeichenobjekt[] = [];

  /**
   * The currently displayed characters.
   * @internal
   */
  displayedCharacters: Zeichenobjekt[] = [];

  /**
   * The array who stores all the grundzeichen.
   * @internal
   */
  grundZeichenListe: string[] = [];

  /**
   * The currently selected Grundzeichen.
   * @internal
   */
  selectedGrundzeichen?: string;

  /**
   * The array who stores all the Schriftzeichen.
   * @internal
   */
  schriftZeichenGruppen: Schriftzeichengruppe[] = [];

  /**
   * The currently selected Schriftzeichengruppe.
   * @internal
   */
  selectedSchriftzeichenGruppe?: Schriftzeichengruppe;

  /**
   * Stores the current selected Zeichenobjekt.
   * @internal
   */
  selectedZeichenObjekt?: Zeichenobjekt;

  /**
   * Filled with one option for "All Characters"; solely technical reasons.
   * @internal
   */
  allCharsOptions = [{label: this.getTranslation('inputChar.all') as string || 'Alle'}];

  /**
   * Filled when all chars are selected; solely technical reasons.
   * @internal
   */
  allCharsModel: {label: string} | undefined = this.allCharsOptions[0];

  constructor(public widgetsConfigService: WidgetsConfigService) {
  }

  /**
   * Fire on initialization
   * @internal
   */
  ngOnInit(): void {
    this.setupCharPicker();
  }

  /**
   * Fire on input changes
   * @param changes List of changes
   * @internal
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.allCharacters) {
      this.setupCharPicker();
    }
  }

  /**
   * Resets all the user selections.
   */
  private resetAllSelection(): void {
    this.allCharsModel = undefined;
  }

  /**
   * Resets all the user base selections.
   */
  private resetGrundzeichenSelection(): void {
    this.selectedGrundzeichen = undefined;
  }

  /**
   * Resets all the user group selections.
   */
  private resetSchriftzeichenGruppeSelection(): void {
    this.selectedSchriftzeichenGruppe = undefined;
  }

  /**
   * Setting up the characters list who must be displayed.
   * @internal
   */
  private resetDisplayedCharacters(): void {
    this.displayedCharacters = this.allCharacters;
    this.selectFirstEntry();
  }

  /**
   * Is fired when the all button get clicked
   * @internal
   */
  onAllSelection(): void {
    this.resetGrundzeichenSelection();
    this.resetSchriftzeichenGruppeSelection();

    this.resetDisplayedCharacters();
  }

  /**
   * Is fired when a base get selected
   * @internal
   */
  onGrundzeichenSelection(): void {
    this.resetAllSelection();
    this.resetSchriftzeichenGruppeSelection();

    this.displayedCharacters = this.allCharacters.filter(z => (z.grundzeichen === '' ? '*' : z.grundzeichen) === this.selectedGrundzeichen);
    this.selectFirstEntry();
  }

  /**
   * Is fired when a base get selected
   * @internal
   */
  onSchriftzeichenGruppeSelection(): void {
    this.resetAllSelection();
    this.resetGrundzeichenSelection();

    this.displayedCharacters = this.allCharacters.filter(z => z.schriftzeichengruppe === this.selectedSchriftzeichenGruppe);
    this.selectFirstEntry();
  }

  /**
   * Is selecting the first zeichenobjekt inside the current list
   * @internal
   */
  private selectFirstEntry(): void {
    this.selectedZeichenObjekt = this.displayedCharacters[0];
  }

  /**
   * Initialize the char picker with it's Grundzeichen, Schriftzeichengruppen and initial state.
   * @internal
   */
  private setupCharPicker(): void {
    this.grundZeichenListe = this.getAvailableGrundzeichen();
    this.schriftZeichenGruppen = this.getAvailableSchriftzeichenGruppen();
    this.resetDisplayedCharacters();
    this.allCharsModel = this.allCharsOptions[0];
  }

  /**
   * Calculates an array of all different Schriftzeichengruppen within @{link allCharacters}.
   * @returns An array containing all different Schriftzeichengruppen.
   */
  private getAvailableSchriftzeichenGruppen(): Schriftzeichengruppe[] {
    const res: Schriftzeichengruppe[] = [];
    for (const char of this.allCharacters) {
      if (!res.includes(char.schriftzeichengruppe)) {
        res.push(char.schriftzeichengruppe);
      }
    }

    return res;
  }

  /**
   * Calculates an array of all different Grundzeichen within @{link allCharacters}.
   * Empty Grundzeichen is transformed to "*".
   * @returns An array containing all different Grundzeichen.
   */
  private getAvailableGrundzeichen(): string[] {
    const res: string[] = [];
    for (const char of this.allCharacters) {
      const grundzeichen = char.grundzeichen === '' ? '*' : char.grundzeichen;
      if (!res.includes(grundzeichen)) {
        if (grundzeichen === '*') {
          res.unshift(grundzeichen);
        } else {
          res.push(grundzeichen);
        }
      }
    }

    return res;
  }

  /**
   * Called when the inner dialog changes its visibility without interference from outside,
   * e.g. via dialog close corner X.
   * Calls open/close functions accordingly (although "visible" might already be set).
   * @param visible The visibility state the inner dialog changed to
   * @internal
   */
  onInnerDialogVisibilityChange(visible: boolean): void {
    if (visible) {
      this.openCharPicker();
    } else {
      this.closeCharPicker();
    }
  }

  /**
   * Opens the character picker
   */
  openCharPicker(): void {
    this.visible = true;
    this.visibleChange.emit(this.visible);
  }

  /**
   * Closes the character picker
   */
  closeCharPicker(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  /**
   * Emits the selected zeichenobjekt
   * @internal
   */
  insertSelectedZeichen(): void {
    if (this.selectedZeichenObjekt) {
      this.insertCharacter.emit(this.selectedZeichenObjekt.zeichen);
    }
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
