import {
  Component,
  ElementRef,
  ErrorHandler,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';
import {Datentyp} from '../../model/datentyp';
import {WidgetsConfigService} from '../../../i18n/widgets-config.service';
import {ButtonModule} from 'primeng/button';
import {InputCharPickerService} from '../../services/input-char-picker.service';

@Component({
  standalone: true,
  selector: 'isy-input-char',
  templateUrl: './input-char.component.html',
  styleUrls: ['./input-char.component.scss'],
  imports: [ButtonModule]
})
export class InputCharComponent implements OnDestroy {
  /**
   * The width of the dialog.
   */
  @Input() width = '740px';

  /**
   * The height of the dialog.
   */
  @Input() height = '460px';

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
  @Input() header?: string;

  /**
   * Determines whether the button is outlined
   */
  @Input() outlinedInputCharButton: boolean = false;

  /**
   * Determines whether the char picker can be closed
   */
  @Input() closable: boolean = true;

  /**
   * Determines whether the char picker can be repositioned manually
   */
  @Input() draggable: boolean = true;

  /**
   * Determines whether the char picker can be resized manually
   */
  @Input() resizable: boolean = false;

  /**
   * Determines whether the picker closes when clicking outside of it
   */
  @Input() dismissableMask: boolean = false;

  /**
   * Determines whether the picker closes when pressing the ESC key
   */
  @Input() closeOnEscape: boolean = true;

  /**
   * Determines whether the picker is displayed as a modal.
   * Enabled by default so PrimeNG's dialog provides the focus trap (keyboard accessibility).
   */
  @Input() modal: boolean = true;

  /**
   * Determines whether the input is displayed
   */
  @Input() isInputDisabled: boolean = false;

  @ViewChild('openDialogButton') openDialogButton!: ElementRef<HTMLButtonElement>;

  /**
   * A service used to translate labels within the widgets library.
   */
  configService = inject(WidgetsConfigService);

  private readonly pickerService = inject(InputCharPickerService);

  private readonly errorHandler = inject(ErrorHandler);

  ngOnDestroy(): void {
    const button = this.openDialogButton?.nativeElement;

    if (!button) {
      return;
    }

    this.pickerService.closeFor(button);
  }

  toggleCharPicker(): void {
    const button = this.openDialogButton?.nativeElement;

    if (!button) {
      return;
    }

    if (this.pickerService.isOpenFor(button)) {
      this.pickerService.close();
      return;
    }

    void this.openCharPicker(button);
  }

  private async openCharPicker(button: HTMLButtonElement): Promise<void> {
    try {
      await this.pickerService.open({
        datentyp: this.datentyp,
        triggerElement: button,
        width: this.width,
        height: this.height,
        header: this.header,
        closable: this.closable,
        draggable: this.draggable,
        resizable: this.resizable,
        dismissableMask: this.dismissableMask,
        closeOnEscape: this.closeOnEscape,
        modal: this.modal,
        onInsert: (zeichen) => this.insertCharacter.emit(zeichen)
      });
    } catch (error: unknown) {
      this.errorHandler.handleError(error);
    }
  }
}
