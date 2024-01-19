import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {InputCharData, Schriftzeichengruppe, Zeichenobjekt, ZeichenSelection} from '../../model/model';
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

  data!: InputCharData[];

  alleHeader!: string;

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
  // onSelection(selection: ButtonTypeEvent): void {
  //   if (selection.enum === ButtonType.ALLE) {
  //     this.onAllSelection();
  //   }
  //
  //   if (selection.enum === ButtonType.GRUNDZEICHEN) {
  //     this.onGrundzeichenSelection(selection.value);
  //   }
  //
  //   if (selection.enum === ButtonType.SCHRIFTZEICHENGRUPPE) {
  //     this.onSchriftzeichenGruppeSelection(selection.value);
  //   }
  // }
  onSelection(selected: ZeichenSelection): void {
    const t = this.data[0];
  }

  initSelectButtonsData(): void {
    this.alleHeader = this.widgetsConfigService.getTranslation('inputChar.headerAllCharacters')!;
    this.data = [
      {
        [this.widgetsConfigService.getTranslation('inputChar.headerBaseChars') as string]: this.grundZeichenListe,
        [this.widgetsConfigService.getTranslation('inputChar.headerGroups') as string]: this.schriftZeichenGruppen
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
