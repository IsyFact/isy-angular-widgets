import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList
} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {WizardDirective} from './wizard.directive';

/**
 * The width of the wizard of not otherwise specified by the user.
 * @internal
 */
const defaultWidth = 50;

/**
 * The height of the wizard of not otherwise specified by the user.
 * @internal
 */
const defaultHeight = 30;

/**
 * A wizard that guides the user step by step through series of forms.
 * Each side needs to have the @link{WizardDirective}.
 */
@Component({
  selector: 'isy-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss']
})
export class WizardComponent implements OnInit, AfterContentInit {

  /**
   * Stores the content that will be projected inside the template
   */
  @ContentChildren(WizardDirective) content!: QueryList<WizardDirective>;

  /**
   * Emits the currently displayed page
   */
  @Output() stepperIndexChange = new EventEmitter<number>();

  /**
   * Emits when the user is currently trying to save to be handled from outside
   */
  @Output() savingChange = new EventEmitter<boolean>();

  /**
   * Emits the current visibility status
   */
  @Output() isVisibleChange = new EventEmitter<boolean>();

  /**
   * Determines whether the wizard is visible
   */
  @Input() isVisible: boolean = false;

  /**
   * Determines whether the wizard is draggable
   */
  @Input() draggable: boolean = false;

  /**
   * Determines whether the wizard is closable
   */
  @Input() closable: boolean = true;

  /**
   * Determines if the modal behind the wizard dialog is displayed
   */
  @Input() modal: boolean = true;

  /**
   * A title to show
   */
  @Input() headerTitle: string = '';

  /**
   * The wizard width in %.
   * Default is 50
   */
  @Input() width: number = defaultWidth;

  /**
   * The wizard height  in %.
   * Default is 30
   */
  @Input() height: number = defaultHeight;

  /**
   * The text of the back button
   */
  @Input() labelBackButton = 'Zurück';

  /**
   * The text of the next button
   */
  @Input() labelNextButton = 'Weiter';

  /**
   * The text of the save button
   */
  @Input() labelSaveButton = 'Speichern';

  /**
   * The text of the close button
   */
  @Input() labelCloseButton = 'Schließen';

  /**
   * Controls whether the next button is enabled which is to be controlled from the outside (e.g. for validation)
   */
  @Input() allowNext: boolean = false;

  /**
   * Determines if the system is saving now
   */
  @Input() isSaved: boolean = false;

  /**
   * The current wizard index
   */
  index: number = 0;

  /**
   * Stores the items of the wizard
   */
  wizardItems: MenuItem[] = [];

  /**
   * Fired on initialization
   */
  ngOnInit(): void {
    this.stepperIndexChange.emit(this.index);
  }

  /**
   * Fired after content initialization
   */
  ngAfterContentInit(): void {
    this.wizardItems = this.content.map((item) => {
      return {
        label: item.isyWizardDirective
      };
    });
  }

  /**
   * Moves the stepper to the next or previous position
   * @param next used for forward/backward navigation
   */
  move(next: boolean): void {
    if (next)
      this.index++;
    else
      this.index--;
  }

  /**
   * Is closing the dialog
   */
  closeDialog(): void {
    this.resetStepper();
    this.close();
    this.save(false);
  }

  /**
   * Informs about the save action
   * @param save reports the saving status
   */
  save(save: boolean): void {
    this.savingChange.emit(save);
  }

  /**
   * Is resetting the stepper position
   */
  private resetStepper(): void {
    this.index = 0;
  }

  /**
   * Is closing the wizard
   */
  private close(): void {
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
  }
}
