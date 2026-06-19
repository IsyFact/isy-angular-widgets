import {
  afterNextRender,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  inject,
  Injector,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {combineLatest} from 'rxjs';
import {InputCharData, InputCharSelection, Schriftzeichengruppe, Zeichenobjekt} from '../../model/model';
import {WidgetsConfigService} from '../../../i18n/widgets-config.service';
import {CharacterService} from '../../services/character.service';
import {ButtonModule} from 'primeng/button';
import {MultiSelectButtonComponent} from '../multi-select-button/multi-select-button.component';
import {InputCharPreviewComponent} from '../input-char-preview/input-char-preview.component';
import {InputCharGridComponent} from '../input-char-grid/input-char-grid.component';
import {RovingTabindexDirective} from '../../directives/roving-tabindex.directive';

/**
 * Selector matching the focusable accordion headers of the filter panel (PrimeNG renders
 * the header host element with `role="button"` and a tabindex).
 */
const FILTER_HEADER_SELECTOR = 'p-accordion-header, p-accordionheader';

/**
 * Selector matching an actual filter value (a toggle/radio button) within the filter panel,
 * as opposed to an accordion header. Activating such a value moves focus into the grid.
 */
const FILTER_VALUE_SELECTOR = 'p-togglebutton, [role="radio"]';

/**
 * Selector matching an accordion panel (the section that groups a header with its values).
 */
const FILTER_PANEL_SELECTOR = 'p-accordion-panel, p-accordionpanel';

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
    InputCharPreviewComponent,
    MultiSelectButtonComponent,
    InputCharGridComponent,
    RovingTabindexDirective
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
   * The left filter panel container, used to resolve the focus target for the grid's ESC.
   * @internal
   */
  @ViewChild('leftPanel') leftPanelRef?: ElementRef<HTMLElement>;

  /**
   * The character grid, used to move focus into it after a filter value was chosen.
   * @internal
   */
  @ViewChild(InputCharGridComponent) gridComponent?: InputCharGridComponent;

  /**
   * A service used to translate labels within the widgets library.
   */
  configService = inject(WidgetsConfigService);

  private readonly charService = inject(CharacterService);

  private readonly destroyRef = inject(DestroyRef);

  private readonly injector = inject(Injector);

  /**
   * The accordion header that was last focused within the filter panel. Used to return
   * focus when ESC is pressed inside the character grid (FR-7.4, case "a").
   */
  private lastFilterHeader?: HTMLElement;

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
   * Tracks the last focused accordion header within the filter panel (FR-7.4).
   * @param event The focus event bubbling out of the filter panel.
   * @internal
   */
  onFilterFocusIn(event: FocusEvent): void {
    const header = (event.target as HTMLElement | null)?.closest<HTMLElement>(FILTER_HEADER_SELECTOR);

    if (header) {
      this.lastFilterHeader = header;
    }
  }

  /**
   * Moves focus into the character grid when a filter value (not an accordion header) was
   * activated with the keyboard, so the user can immediately pick a specific character.
   * The focus is deferred until the grid has re-rendered with the filtered characters.
   * @param element The filter item that was activated via keyboard.
   * @internal
   */
  onFilterItemActivate(element: HTMLElement): void {
    if (!element.closest(FILTER_VALUE_SELECTOR)) {
      return;
    }

    afterNextRender(() => this.gridComponent?.focusActiveCell(), {injector: this.injector});
  }

  /**
   * Handles ESC pressed inside the filter panel: if focus is on a filter value within an
   * accordion section, moves focus back up to that section's header so the user can choose
   * a different group, keeping the dialog open. ESC on a header (or outside a section) is
   * left untouched, so PrimeNG's `closeOnEscape` closes the dialog as before.
   * @param event The keyboard event emitted by the filter directive.
   * @internal
   */
  onFilterEscape(event: KeyboardEvent): void {
    const value = (event.target as HTMLElement | null)?.closest(FILTER_VALUE_SELECTOR);

    if (!value) {
      return;
    }

    const header = value.closest(FILTER_PANEL_SELECTOR)?.querySelector<HTMLElement>(FILTER_HEADER_SELECTOR);

    if (!header) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    header.focus();
  }

  /**
   * Handles ESC pressed inside the character grid: moves focus back to the last active
   * filter header and keeps the dialog open (FR-7). If no focusable filter target exists,
   * the event is left untouched so PrimeNG's `closeOnEscape` closes the dialog (FR-7.8).
   * @param event The keyboard event emitted by the grid.
   * @internal
   */
  onGridEscape(event: KeyboardEvent): void {
    const target = this.resolveLastFilterHeader();

    if (!target) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    // Focusing the header lets the filter's `isyRovingTabindex` directive re-apply the
    // roving tabindex via its `focusin` handler (FR-7.3).
    target.focus();
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
    if (!this.selectedZeichenObjekt) {
      return;
    }

    this.insertCharacter.emit(this.selectedZeichenObjekt.zeichen);
  }

  /**
   * Get translated text
   * @param path to the translated text
   * @returns translated text
   */
  getTranslation(path: string): string {
    return this.configService.getTranslation(path);
  }

  /**
   * Resolves the accordion header that should receive focus when ESC is pressed in the grid
   * (FR-7.4): the last focused header if still present, otherwise the header of the expanded
   * section, otherwise the last header in DOM order. Returns `undefined` if no focusable
   * (non-disabled) header exists.
   * @returns The target header element, or `undefined` when none is available.
   */
  private resolveLastFilterHeader(): HTMLElement | undefined {
    const panel = this.leftPanelRef?.nativeElement;

    if (!panel) {
      return undefined;
    }

    if (this.lastFilterHeader && panel.contains(this.lastFilterHeader)) {
      return this.lastFilterHeader;
    }

    const headers = Array.from(panel.querySelectorAll<HTMLElement>(FILTER_HEADER_SELECTOR)).filter(
      (header) => header.getAttribute('data-p-disabled') !== 'true'
    );

    if (headers.length === 0) {
      return undefined;
    }

    const expanded = headers.find((header) => header.getAttribute('aria-expanded') === 'true');

    return expanded ?? headers[headers.length - 1];
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
