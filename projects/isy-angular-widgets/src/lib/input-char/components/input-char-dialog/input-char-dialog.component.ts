import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {
  ButtonTypeIdentifier,
  InputCharData,
  Schriftzeichengruppe,
  Zeichenobjekt,
  ZeichenSelection
} from '../../model/model';
import {WidgetsConfigService} from '../../../i18n/widgets-config.service';
import {TranslateService} from '@ngx-translate/core';
import {CharacterService} from '../../services/character.service';

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
  @Input() charList: Zeichenobjekt[] = [];

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

  /**
   * Includes the displaying data for the left side of the view
   * @internal
   */
  leftViewData!: InputCharData[];

  /**
   * Header of all select button
   * @internal
   */
  allButtonHeader!: string;

  constructor(
    public widgetsConfigService: WidgetsConfigService,
    public translate: TranslateService,
    private charService: CharacterService
  ) {
    this.translate.onLangChange.subscribe(() => {
      this.initSelectButtonsData();
    });
  }

  /**
   * Fire on input changes
   * @internal
   */
  ngOnChanges(): void {
    this.setupCharPicker();
  }

  /**
   * Fired on user zeichen selection
   * @param selected Incoming event
   */
  onSelection(selected: ZeichenSelection): void {
    const buttonType = this.getTranslation(`inputChar.enum.${selected.identifier.toLowerCase()}`);

    if (!buttonType) {
      this.onAllSelection();
    }

    if (buttonType === (ButtonTypeIdentifier.GRUNDZEICHEN as string)) {
      this.onGrundzeichenSelection(selected.zeichen);
    }

    if (buttonType === (ButtonTypeIdentifier.SCHRIFTZEICHENGRUPPE as string)) {
      this.onSchriftzeichenGruppeSelection(selected.zeichen as Schriftzeichengruppe);
    }
  }

  /**
   * Inits the select button view data
   * @internal
   */
  initSelectButtonsData(): void {
    this.allButtonHeader = this.getTranslation('inputChar.headerAllCharacters')!;
    this.leftViewData = [
      {
        [this.getTranslation('inputChar.headerBaseChars')]: this.grundZeichenListe,
        [this.getTranslation('inputChar.headerGroups')]: this.schriftZeichenGruppen
      }
    ];
  }

  /**
   * Setting up the characters list who must be displayed.
   * @internal
   */
  private resetDisplayedCharacters(): void {
    this.displayedCharacters = this.charList;
    this.selectFirstEntry();
  }

  /**
   * Is fired when the all button get clicked
   * @internal
   */
  onAllSelection(): void {
    this.resetDisplayedCharacters();
  }

  /**
   * Is fired when a base get selected
   * @param grundzeichen From the user selected grundzeichen
   * @internal
   */
  onGrundzeichenSelection(grundzeichen?: string): void {
    this.displayedCharacters = this.charService.filterByGrundzeichen(this.charList, grundzeichen);
    this.selectFirstEntry();
  }

  /**
   * Is fired when a base get selected
   * @param schriftzeichenGruppe From the user selected schriftzeichengruppe
   * @internal
   */
  onSchriftzeichenGruppeSelection(schriftzeichenGruppe?: Schriftzeichengruppe): void {
    this.displayedCharacters = this.charService.filterBySchriftzeichenGruppe(this.charList, schriftzeichenGruppe);
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
    this.initSelectButtonsData();
    this.resetDisplayedCharacters();
    this.allCharsModel = this.allCharsOptions[0];
  }

  /**
   * Calculates an array of all different Schriftzeichengruppen within @{link allCharacters}.
   * @returns An array containing all different Schriftzeichengruppen.
   */
  private getAvailableSchriftzeichenGruppen(): Schriftzeichengruppe[] {
    return this.charService.getSchriftzeichenGruppen(this.charList);
  }

  /**
   * Calculates an array of all different Grundzeichen within @{link allCharacters}.
   * Empty Grundzeichen is transformed to "*".
   * @returns An array containing all different Grundzeichen.
   */
  private getAvailableGrundzeichen(): string[] {
    return this.charService.getGrundzeichen(this.charList);
  }

  /**
   * Emits the selected zeichenobjekt
   * @internal
   */
  insertSelectedZeichen(): void {
    this.insertCharacter.emit(this.selectedZeichenObjekt!.zeichen);
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
