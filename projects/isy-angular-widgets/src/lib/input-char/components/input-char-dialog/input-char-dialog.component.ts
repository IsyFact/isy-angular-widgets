import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {Schriftzeichengruppe, SelectButtonOptions, Zeichenobjekt} from '../../model/model';
import {WidgetsConfigService} from '../../../i18n/widgets-config.service';

/**
 * @internal
 */
@Component({
  selector: 'isy-input-char-dialog',
  templateUrl: './input-char-dialog.component.html',
  styleUrls: ['./input-char-dialog.component.scss']
})
export class InputCharDialogComponent implements OnChanges {
  /**
   * Emits a character chosen to insert by the user.
   */
  @Output() insertCharacter = new EventEmitter<string>();

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
  allCharsOptions = [{label: 'Alle'}];

  /**
   * Filled when all chars are selected; solely technical reasons.
   * @internal
   */
  allCharsModel?: {label: string};

  opt: SelectButtonOptions = {
    all: this.allCharsOptions,
    grundzeichen: this.grundZeichenListe,
    schriftzeichenGruppen: this.schriftZeichenGruppen
  };

  constructor(public widgetsConfigService: WidgetsConfigService) {
    this.allCharsOptions = [{label: this.getTranslation('inputChar.all') || 'Alle'}];
    this.allCharsModel = this.allCharsOptions[0];
  }

  /**
   * Fire on input changes
   * @internal
   */
  ngOnChanges(): void {
    this.setupCharPicker();
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
    const res = [...new Set(this.allCharacters.map((item) => (item.grundzeichen === '' ? '*' : item.grundzeichen)))];

    // Put * to the first position if present
    const specialPos = res.indexOf('*');
    if (specialPos > 0) {
      res.splice(specialPos, 1);
      res.unshift('*');
    }

    return res;
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
  getTranslation(path: string): string {
    return this.widgetsConfigService.getTranslation(path) as string;
  }
}
