import {
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  ViewChild
} from '@angular/core';
import {InputCharDialogDirective} from '../../directives/input-char-dialog.directive';
import {InputCharAllCharsButtonComponent} from '../input-char-all-chars-button/input-char-all-chars-button.component';
import {InputCharSelectButtonComponent} from '../input-char-select-button/input-char-select-button.component';
import {
  InputCharPreviewCharListComponent
} from '../input-char-preview-char-list/input-char-preview-char-list.component';
import {Datentyp} from '../../model/datentyp';
import {SchriftZeichen, Zeichenobjekt} from '../../model/model';
import {CharacterService} from '../../services/character.service';

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

  /**
   * Determines which set of characters (datatype) according to DIN 91379 to show
   */
  @Input() datentyp: Datentyp = Datentyp.DATENTYP_C;

  /**
   * The array who stores all the characters
   */
  private zeichenListe = this.charService.getCharacters();

  constructor(private charService: CharacterService) {
  }


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
  @Input() zeichenObjekteToDisplay!: Zeichenobjekt[];

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
   * Setting up the characters list who must be displayed
   * @internal
   */
  setupCharacterListToDisplay(): void {
    this.zeichenObjekteToDisplay = this.zeichenListe;
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
   * Is selecting the first zeichenobjekt inside the current list
   * @internal
   */
  selectFirstEntry(): void {
    this.selectedZeichenObjekt = this.zeichenObjekteToDisplay[0];
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
   * @param zeichenObjekt The selected zeichenobjekt
   * @internal
   */
  getSelectedZeichenObjekt(zeichenObjekt: Zeichenobjekt): void {
    this.insertCharacter.emit(zeichenObjekt.zeichen);
  }

}
