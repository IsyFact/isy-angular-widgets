import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
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
  allCharsOptions!: any[];

  /**
   * Filled when all chars are selected; solely technical reasons.
   * @internal
   */
  allCharsModel!: string | undefined;

  constructor(public widgetsConfigService: WidgetsConfigService) {
    this.allCharsOptions = [{label: this.getTranslation('inputChar.all') as string || 'Alle'}];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    this.allCharsModel = this.allCharsOptions[0] as string;
  }

  /**
   * Fire on input changes
   * @internal
   */
  ngOnChanges(): void {
    this.setupCharPicker();
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
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

    const res = [...new Set(this.allCharacters.map(item => item.grundzeichen === '' ? '*' : item.grundzeichen))];

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
  getTranslation(path: string): any {
    return this.widgetsConfigService.getTranslation(path);
  }
}
