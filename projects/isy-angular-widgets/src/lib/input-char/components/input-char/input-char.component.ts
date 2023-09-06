import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {Datentyp} from '../../model/datentyp';
import {CharacterService} from '../../services/character.service';
import {Zeichenobjekt} from '../../model/model';

@Component({
  selector: 'isy-input-char',
  templateUrl: './input-char.component.html',
  styleUrls: ['./input-char.component.scss']
})
export class InputCharComponent implements OnChanges {

  /**
   * The current value
   */
  @Output() insertCharacter = new EventEmitter<string>();

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

  allCharacters: Zeichenobjekt[] = [];

  constructor(private charService: CharacterService) {
  }

  ngOnChanges(): void {
    this.getCharactersByDatentyp(this.datentyp);
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
   * Setting up the characters list who must be displayed
   * @param datentyp Used as filter
   * @internal
   */
  private getCharactersByDatentyp(datentyp: Datentyp): void {
    const allowedGroups = this.charService.getGroupsByDataType(datentyp);
    this.allCharacters = this.charService.getCharacters().filter(z => allowedGroups.includes(z.schriftzeichengruppe));
  }
}
