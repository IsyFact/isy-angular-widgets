import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {ButtonType, Schriftzeichengruppe, SelectButtonOptions, Zeichenobjekt} from '../../model/model';
import {WidgetsConfigService} from '../../../i18n/widgets-config.service';

@Component({
  selector: 'isy-input-char-dialog-left-side',
  templateUrl: './input-char-dialog-left-side.component.html',
  styleUrl: './input-char-dialog-left-side.component.css'
})
export class InputCharDialogLeftSideComponent implements OnChanges {

  @Output() atSelection = new EventEmitter<unknown>();

  /**
   * All characters the dialog should display.
   */
  @Input() allCharacters: Zeichenobjekt[] = [];

  @Input() options: SelectButtonOptions = {all:[], grundzeichen: [], schriftzeichenGruppen: []};

  /**
   * The currently displayed characters.
   * @internal
   */
  displayedCharacters: Zeichenobjekt[] = [];

  /**
   * Filled with one option for "All Characters"; solely technical reasons.
   * @internal
   */
  allCharsOptions = [{label: 'Alle'}];

  /**
   * The array who stores all the grundzeichen.
   * @internal
   */
  grundZeichenListe: string[] = [];

  /**
   * The array who stores all the Schriftzeichen.
   * @internal
   */
  schriftZeichenGruppen: Schriftzeichengruppe[] = [];

  /**
   * Filled when all chars are selected; solely technical reasons.
   * @internal
   */
  allCharsModel?: {label: string};

  /**
   * The currently selected Grundzeichen.
   * @internal
   */
  selectedGrundzeichen?: string;

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

  constructor(public widgetsConfigService: WidgetsConfigService) {
    // this.allCharsOptions = [{label: this.getTranslation('inputChar.all') || 'Alle'}];
    // this.allCharsModel = this.allCharsOptions[0];
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
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

  onButtonSelection(buttonType: ButtonType): void {
    if (buttonType === ButtonType.ALLE) {
      this.resetGrundzeichenSelection();
      this.resetSchriftzeichenGruppeSelection();
      this.resetDisplayedCharacters();
    }

    if (buttonType === ButtonType.GRUNDZEICHEN) {
      this.resetAllSelection();
      this.resetSchriftzeichenGruppeSelection();

      this.displayedCharacters = this.allCharacters.filter(
        (z) => (z.grundzeichen === '' ? '*' : z.grundzeichen) === this.selectedGrundzeichen
      );
    }

    if (buttonType === ButtonType.SCHRIFTZEICHEN) {
      this.resetAllSelection();
      this.resetGrundzeichenSelection();

      this.displayedCharacters = this.allCharacters.filter(
        (z) => z.schriftzeichengruppe === this.selectedSchriftzeichenGruppe
      );
    }
    this.selectFirstEntry();
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
  }

  /**
   * Is selecting the first zeichenobjekt inside the current list
   * @internal
   */
  private selectFirstEntry(): void {
    this.selectedZeichenObjekt = this.displayedCharacters[0];
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
