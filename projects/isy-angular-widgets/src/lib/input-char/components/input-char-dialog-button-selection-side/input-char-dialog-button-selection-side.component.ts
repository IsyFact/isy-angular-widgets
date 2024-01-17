import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ButtonType, ButtonTypeEvent, Schriftzeichengruppe} from '../../model/model';
import {WidgetsConfigService} from '../../../i18n/widgets-config.service';

@Component({
  selector: 'isy-input-char-dialog-button-selection-side',
  templateUrl: './input-char-dialog-button-selection-side.component.html',
  styleUrl: './input-char-dialog-button-selection-side.component.scss'
})
export class InputCharDialogButtonSelectionSideComponent {
  /**
   * Emits the user selection
   */
  @Output() atSelection = new EventEmitter<ButtonTypeEvent>();

  /**
   * The array who stores all the grundzeichen.
   * @internal
   */
  @Input() grundZeichenListe: string[] = [];

  /**
   * The array who stores all the Schriftzeichen.
   * @internal
   */
  @Input() schriftZeichenGruppen: Schriftzeichengruppe[] = [];

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
   * The currently selected Grundzeichen.
   * @internal
   */
  selectedGrundzeichen?: string;

  /**
   * The currently selected Schriftzeichengruppe.
   * @internal
   */
  selectedSchriftzeichenGruppe?: Schriftzeichengruppe;

  constructor(public widgetsConfigService: WidgetsConfigService) {
    this.allCharsModel = this.allCharsOptions[0];
  }

  /**
   * Is fired when the all button get clicked
   * @internal
   */
  onAllSelection(): void {
    this.atSelection.emit({type: ButtonType.ALLE});

    this.resetGrundzeichenSelection();
    this.resetSchriftzeichenGruppeSelection();
  }

  /**
   * Is fired when a base get selected
   * @internal
   */
  onGrundzeichenSelection(): void {
    this.atSelection.emit({type: ButtonType.GRUNDZEICHEN, grundzeichen: this.selectedGrundzeichen});

    this.resetAllSelection();
    this.resetSchriftzeichenGruppeSelection();
  }

  /**
   * Is fired when a base get selected
   * @internal
   */
  onSchriftzeichenGruppeSelection(): void {
    this.atSelection.emit({
      type: ButtonType.SCHRIFTZEICHENGRUPPE,
      schriftzeichenGruppe: this.selectedSchriftzeichenGruppe
    });

    this.resetAllSelection();
    this.resetGrundzeichenSelection();
  }

  /**
   * Resets all the user selections.
   */
  resetAllSelection(): void {
    this.allCharsModel = undefined;
  }

  /**
   * Resets all the user base selections.
   */
  resetGrundzeichenSelection(): void {
    this.selectedGrundzeichen = undefined;
  }

  /**
   * Resets all the user group selections.
   */
  resetSchriftzeichenGruppeSelection(): void {
    this.selectedSchriftzeichenGruppe = undefined;
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
