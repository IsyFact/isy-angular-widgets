import {Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild} from '@angular/core';
import {SchriftZeichen, Zeichenobjekt} from '../../model/model';
import {InputCharSelectButtonComponent} from '../input-char-select-button/input-char-select-button.component';
import {InputCharAllCharsButtonComponent} from '../input-char-all-chars-button/input-char-all-chars-button.component';
import {Datentyp} from '../../model/datentyp';
import {CharacterService} from '../../services/character.service';
import {
  InputCharPreviewCharListComponent
} from '../input-char-preview-char-list/input-char-preview-char-list.component';

@Component({
  selector: 'isy-input-char',
  templateUrl: './input-char.component.html',
  styleUrls: ['./input-char.component.scss']
})
export class InputCharComponent implements OnInit, OnChanges {

  /**
   * The array who stores all the characters
   */
  private zeichenListe = this.charService.getCharacters();

  /**
   * The current value
   */
  @Output() insertCharacter = new EventEmitter<string>();

  /**
   * Used for getting access to the all button
   */
  @ViewChild('allChars')
  private allChars!: InputCharAllCharsButtonComponent;

  /**
   * Used for getting access to the base accordion tab
   */
  @ViewChild('base')
  private base!: InputCharSelectButtonComponent;

  /**
   * Used for getting access to the group accordion tab
   */
  @ViewChild('group')
  private group!: InputCharSelectButtonComponent;

  /**
   * Used for getting access to the character preview panel
   */
  @ViewChild('charPreview')
  private charPreview!: InputCharPreviewCharListComponent;

  /**
   * Determines which set of characters (datatype) according to DIN 91379 to show
   */
  @Input() datentyp: Datentyp = Datentyp.DATENTYP_C;

  /**
   * A title to show
   */
  @Input() header: string = '';

  /**
   * Determines whether the char picker can be closed
   */
  @Input() isDialogClosable: boolean = true;

  /**
   * Determines whether the char picker can be repositioned manually
   */
  @Input() isDialogDraggable: boolean = true;

  /**
   * Determines whether the char picker can be resized manually
   */
  @Input() isDialogResizable: boolean = false;

  /**
   * Determines whether the picker closes when clicking outside of it
   */
  @Input() isDialogClosingOnOutsideClick: boolean = false;

  /**
   * Determines whether the picker closes when pressing the ESC key
   */
  @Input() isDialogClosingOnEscape: boolean = true;

  /**
   * Determines whether the picker is displayed as a modal
   */
  @Input() isDialogModalDisplayed: boolean = false;

  /**
   * Determines whether the input is displayed
   */
  @Input() isInputDisabled: boolean = false;

  /**
   * Controls the char picker visibility
   * @internal
   */
  visible: boolean = false;

  /**
   * The array who stores the active states of all accordion tabs
   * @internal
   */
  activeState: boolean[] = [false, false];

  /**
   * The array who stores all the grundzeichen
   * @internal
   */
  grundZeichenListe!: string[];

  /**
   * The array who stores all the schriftzeichen
   * @internal
   */
  schriftZeichenGruppen!: SchriftZeichen[];

  /**
   * The array who stores all the zeichenobjekte
   * @internal
   */
  zeichenObjekteToDisplay!: Zeichenobjekt[];

  /**
   * Stores the current selected zeichenobjekt
   * @internal
   */
  selectedZeichenObjekt?: Zeichenobjekt;

  constructor(private charService: CharacterService) {
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
   * Toggles the character picker
   */
  toggleCharPicker(): void {
    if (this.visible) {
      this.closeCharPicker();
    } else {
      this.openCharPicker();
    }
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
   * Initialize the char picker
   * @internal
   */
  setupCharPicker(): void {
    this.getCharactersByDatentyp(this.datentyp);
    this.grundZeichenListe = this.charService.getGrundZeichenAsList(this.zeichenListe);
    this.schriftZeichenGruppen = this.charService.getSchriftZeichenAsObjectArray();
    this.schriftZeichenGruppen = this.charService.filterSchriftzeichenGruppenBySchriftzeichen(this.schriftZeichenGruppen, this.datentyp);
  }

  /**
   * Setting up the characters list who must be displayed
   * @param datentyp Used as filter
   * @internal
   */
  getCharactersByDatentyp(datentyp: Datentyp): void {
    const allowedGroups = this.charService.getGroupsByDataType(datentyp);
    this.zeichenListe = this.charService.getCharacters().filter(z => allowedGroups.includes(z.schriftzeichengruppe));
    this.setupCharacterListToDisplay();
  }

  /**
   * Setting up the characters list who must be displayed
   * @internal
   */
  setupCharacterListToDisplay(): void {
    this.zeichenObjekteToDisplay = this.zeichenListe;
    this.selectFirstEntry();
  }

  /**
   * Is fired on dialog closing
   * @internal
   */
  onDialogClose(): void {
    this.charPreview.reset();
    this.allChars.onAllSelection();
  }

  /**
   * Resets all the user selections
   */
  resetAllSelection(): void {
    this.allChars.reset();
  }

  /**
   * Resets all the user base selections
   */
  resetBaseSelection(): void {
    this.base.reset();
  }

  /**
   * Resets all the user group selections
   */
  resetGroupSelection(): void {
    this.group.reset();
  }

  /**
   * Is fired when the all button get clicked
   * @internal
   */
  onAllSelection(): void {
    this.resetBaseSelection();
    this.resetGroupSelection();

    this.setupCharacterListToDisplay();
  }

  /**
   * Is fired when a base get selected
   * @param base The selected base
   * @internal
   */
  onBaseSelection(base: string): void {
    this.resetAllSelection();
    this.resetGroupSelection();

    this.zeichenObjekteToDisplay = this.charService.filterZeichenobjekteByBase(this.zeichenListe, base);
    this.selectFirstEntry();
  }

  /**
   * Is fired when a base get selected
   * @param group The selected group
   * @internal
   */
  onGroupSelection(group: string): void {
    this.resetAllSelection();
    this.resetBaseSelection();

    this.zeichenObjekteToDisplay = this.charService.filterZeichenobjekteByGroup(this.zeichenListe, group);
    this.selectFirstEntry();
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
   * @param zeichenObjekt The selected zeichenobjekt
   * @internal
   */
  getSelectedZeichenObjekt(zeichenObjekt: Zeichenobjekt): void {
    this.insertCharacter.emit(zeichenObjekt.zeichen);
  }

  /**
   * Is selecting the first zeichenobjekt inside the current list
   * @internal
   */
  selectFirstEntry(): void {
    this.selectedZeichenObjekt = this.zeichenObjekteToDisplay[0];
  }
}
