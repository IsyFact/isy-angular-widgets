import {Component, ContentChildren, EventEmitter, Input, OnChanges, OnInit, Output, QueryList} from '@angular/core';
import {InputCharDialogDirective} from '../../directives/input-char-dialog.directive';
import {Schriftzeichengruppe, Zeichenobjekt} from '../../model/model';

/**
 * @internal
 */
@Component({
  selector: 'isy-input-char-dialog',
  templateUrl: './input-char-dialog.component.html',
  styleUrls: ['./input-char-dialog.component.scss']
})
export class InputCharDialogComponent implements OnInit, OnChanges {
  @ContentChildren(InputCharDialogDirective) content!: QueryList<InputCharDialogDirective>;

  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  /**
   * The current value
   */
  @Output() insertCharacter = new EventEmitter<string>();

  @Input() header!: string;

  @Input() width = '775px';

  @Input() height = '460px';

  @Input() closable = true;

  @Input() draggable = true;

  @Input() resizable = false;

  @Input() closeOnClickOutside = false;

  @Input() closeOnEscape = true;

  @Input() modal = false;

  @Input() allCharacters: Zeichenobjekt[] = [];

  displayedCharacters: Zeichenobjekt[] = [];

  /**
   * The array who stores all the grundzeichen
   * @internal
   */
  grundZeichenListe: string[] = [];

  selectedGrundzeichen?: string;

  /**
   * The array who stores all the schriftzeichen
   * @internal
   */
  schriftZeichenGruppen: Schriftzeichengruppe[] = [];

  selectedSchriftzeichenGruppe?: Schriftzeichengruppe;

  /**
   * Stores the current selected zeichenobjekt
   * @internal
   */
  selectedZeichenObjekt?: Zeichenobjekt;

  /**
   * The array who stores the active states of all accordion tabs
   * @internal
   */
  activeState: boolean[] = [false, false];

  /**
   * Filled when all chars are selected; solely technical reasons.
   * @internal
   */
  allCharsModel: string = '';

  /**
   * Is fired on dialog closing
   * @internal
   */
  onDialogClose(): void {
    this.selectedZeichenObjekt = this.allCharacters[0];
  }

  /**
   * Resets all the user selections
   */
  resetAllSelection(): void {
    this.allCharsModel = '';
  }

  /**
   * Resets all the user base selections
   */
  resetBaseSelection(): void {
    this.selectedGrundzeichen = undefined;
  }

  /**
   * Resets all the user group selections
   */
  resetGroupSelection(): void {
    this.selectedSchriftzeichenGruppe = undefined;
  }

  /**
   * Setting up the characters list who must be displayed
   * @internal
   */
  resetDisplayedCharacters(): void {
    this.displayedCharacters = this.allCharacters;
    this.selectFirstEntry();
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
   * @internal
   */
  ngOnChanges(): void {
    this.setupCharPicker();
  }

  /**
   * Handles the opening and closing of the accordion tabs
   * @param index the index position of the selected accordion tab
   */
  toggleTab(index: number): void {
    this.activeState[index] = !this.activeState[index];
  }


  /**
   * Is fired when the all button get clicked
   * @internal
   */
  onAllSelection(): void {
    this.resetBaseSelection();
    this.resetGroupSelection();

    this.resetDisplayedCharacters();
  }

  /**
   * Is fired when a base get selected
   * @internal
   */
  onBaseSelection(): void {
    this.resetAllSelection();
    this.resetGroupSelection();

    this.displayedCharacters = this.allCharacters.filter(z => z.grundzeichen === this.selectedGrundzeichen);
    this.selectFirstEntry();
  }

  /**
   * Is fired when a base get selected
   * @internal
   */
  onGroupSelection(): void {
    this.resetAllSelection();
    this.resetBaseSelection();

    this.displayedCharacters = this.allCharacters.filter(z => z.schriftzeichengruppe === this.selectedSchriftzeichenGruppe);
    this.selectFirstEntry();
  }


  /**
   * Is selecting the first zeichenobjekt inside the current list
   * @internal
   */
  selectFirstEntry(): void {
    this.selectedZeichenObjekt = this.displayedCharacters[0];
  }


  /**
   * Initialize the char picker
   * @internal
   */
  setupCharPicker(): void {
    this.grundZeichenListe = this.getAvailableGrundzeichen();
    this.schriftZeichenGruppen = this.getAvailableSchriftzeichenGruppen();
  }

  private getAvailableSchriftzeichenGruppen(): Schriftzeichengruppe[] {
    const res: Schriftzeichengruppe[] = [];
    for (const char of this.allCharacters) {
      if (!res.includes(char.schriftzeichengruppe)) {
        res.push(char.schriftzeichengruppe);
      }
    }

    return res;
  }

  getAvailableGrundzeichen(): string[] {
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
  }

  /**
   * Closes the character picker
   */
  closeCharPicker(): void {
    this.visible = false;
    this.onDialogClose();
  }

  /**
   * Is displaying the selected zeichenobjekt
   * @param zeichenobjekt the selected zeichenobjekt who must be displayed
   * @internal
   */
  previewZeichenObjekt(zeichenobjekt: Zeichenobjekt): void {
    this.selectedZeichenObjekt = zeichenobjekt;
  }

  /**
   * Emits the selected zeichenobjekt
   * @internal
   */
  emitSelectedZeichenObjekt(): void {
    if (this.selectedZeichenObjekt) {
      this.insertCharacter.emit(this.selectedZeichenObjekt.zeichen);
    }
  }

}
