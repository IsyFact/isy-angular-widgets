import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {combineLatest} from 'rxjs';
import {InputCharData, InputCharSelection, Schriftzeichengruppe, Zeichenobjekt} from '../../model/model';
import {WidgetsConfigService} from '../../../i18n/widgets-config.service';
import {CharacterService} from '../../services/character.service';
import {ButtonModule} from 'primeng/button';
import {SelectButtonModule} from 'primeng/selectbutton';
import {AccordionModule} from 'primeng/accordion';
import {MultiSelectButtonComponent} from '../multi-select-button/multi-select-button.component';
import {FormsModule} from '@angular/forms';
import {InputCharPreviewComponent} from '../input-char-preview/input-char-preview.component';

/**
 * @internal
 */
@Component({
  standalone: true,
  selector: 'isy-input-char-dialog',
  templateUrl: './input-char-dialog.component.html',
  styleUrls: ['./input-char-dialog.component.scss'],
  imports: [
    ButtonModule,
    SelectButtonModule,
    AccordionModule,
    FormsModule,
    InputCharPreviewComponent,
    MultiSelectButtonComponent
  ]
})
export class InputCharDialogComponent implements OnChanges, OnInit {
  /**
   * Emits a character chosen to insert by the user.
   */
  @Output() insertCharacter = new EventEmitter<string>();

  /**
   * Emits the current filter selection.
   * @internal
   */
  @Output() selectionChange = new EventEmitter<InputCharSelection | undefined>();

  /**
   * Emits the currently selected character.
   * @internal
   */
  @Output() selectedCharacterChange = new EventEmitter<string | undefined>();

  /**
   * All characters the dialog should display.
   */
  @Input() charList: Zeichenobjekt[] = [];

  /**
   * Resets the dialog selection state when the picker context changes.
   * @internal
   */
  @Input() resetKey: number = 0;

  /**
   * Current filter selection.
   * @internal
   */
  @Input() selection: InputCharSelection | undefined;

  /**
   * Current selected character.
   * @internal
   */
  @Input() selectedCharacter: string | undefined;

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
   * The array who stores all the Schriftzeichen.
   * @internal
   */
  schriftZeichenGruppen: Schriftzeichengruppe[] = [];

  /**
   * Stores the current selected Zeichenobjekt.
   * @internal
   */
  selectedZeichenObjekt?: Zeichenobjekt;

  /**
   * Includes the displaying data for the left side of the view
   * @internal
   */
  leftViewData: InputCharData = {
    baseChars: {
      label: '',
      values: []
    },
    groups: {
      label: '',
      values: []
    }
  };

  /**
   * Header of all select button
   * @internal
   */
  allButtonHeader!: string;

  /**
   * A service used to translate labels within the widgets library.
   */
  configService = inject(WidgetsConfigService);

  private readonly charService = inject(CharacterService);

  private readonly destroyRef = inject(DestroyRef);

  /**
   * Fire on component initialization
   * @internal
   */
  ngOnInit(): void {
    combineLatest([
      this.configService.getTranslation$('inputChar.headerBaseChars'),
      this.configService.getTranslation$('inputChar.headerGroups')
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.initSelectButtonsData();
      });
  }

  /**
   * Fire on input changes
   * @param changes The changes detected in the input properties
   * @internal
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.charList || changes.resetKey || changes.selection || changes.selectedCharacter) {
      this.setupCharPicker();
    }
  }

  /**
   * Fired on user zeichen selection
   * @param selected Incoming event
   */
  onSelection(selected: InputCharSelection | undefined): void {
    this.selection = selected;
    this.selectionChange.emit(selected);
    this.applySelection(selected);
  }

  /**
   * Fired when the selected character changes.
   * @param zeichenObjekt The selected character object.
   * @internal
   */
  onSelectedZeichenObjektChange(zeichenObjekt: Zeichenobjekt | undefined): void {
    this.selectedZeichenObjekt = zeichenObjekt;
    this.selectedCharacterChange.emit(zeichenObjekt?.zeichen);
  }

  /**
   * Inits the select button view data
   * @internal
   */
  initSelectButtonsData(): void {
    this.leftViewData = {
      baseChars: {
        label: this.getTranslation('inputChar.headerBaseChars'),
        values: this.grundZeichenListe
      },
      groups: {
        label: this.getTranslation('inputChar.headerGroups'),
        values: this.schriftZeichenGruppen
      }
    };
  }

  /**
   * Setting up the characters list who must be displayed.
   * @internal
   */
  resetDisplayedCharacters(): void {
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
   * Initialize the char picker with it's Grundzeichen, Schriftzeichengruppen and initial state.
   * @internal
   */
  setupCharPicker(): void {
    this.grundZeichenListe = this.getAvailableGrundzeichen();
    this.schriftZeichenGruppen = this.getAvailableSchriftzeichenGruppen();
    this.initSelectButtonsData();
    this.applySelection(this.selection);
    this.restoreSelectedCharacter(this.selectedCharacter);
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
    return this.configService.getTranslation(path);
  }

  private applySelection(selected: InputCharSelection | undefined): void {
    switch (selected?.group) {
      case 'baseChars': {
        this.onGrundzeichenSelection(selected.value);
        break;
      }
      case 'groups': {
        this.onSchriftzeichenGruppeSelection(selected.value as Schriftzeichengruppe);
        break;
      }
      default: {
        this.onAllSelection();
        break;
      }
    }
  }

  private restoreSelectedCharacter(selectedCharacter: string | undefined): void {
    if (!selectedCharacter) {
      return;
    }

    const selectedZeichenObjekt = this.displayedCharacters.find((item) => item.zeichen === selectedCharacter);

    if (!selectedZeichenObjekt) {
      return;
    }

    this.selectedZeichenObjekt = selectedZeichenObjekt;
  }

  /**
   * Is selecting the first zeichenobjekt inside the current list
   * @internal
   */
  private selectFirstEntry(): void {
    this.selectedZeichenObjekt = this.displayedCharacters[0];
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
}
