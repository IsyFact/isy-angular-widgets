import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges
} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {WizardDirective} from '../../directives/wizard.directive';

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
  templateUrl: './wizard.component.html'
})
export class WizardComponent implements OnInit, AfterContentInit, OnChanges {
  /**
   * Stores the content that will be projected inside the template
   */
  @ContentChildren(WizardDirective) content!: QueryList<WizardDirective>;

  /**
   * @deprecated The Output should not be used. Use the Output indexChange
   * Emits the currently displayed page
   */
  @Output() stepperIndexChange = new EventEmitter<number>();

  /**
   * Emits the currently displayed page
   */
  @Output() indexChange = new EventEmitter<number>();

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
  items: MenuItem[] = [];

  /**
   * Fired on initialization
   */
  ngOnInit(): void {
    this.emitIndex();
    this.indexChange.subscribe(() => {
      this.stepperIndexChange.emit(this.index);
    });
  }

  /**
   * Fired after content initialization
   */
  ngAfterContentInit(): void {
    this.items = this.content.map((item) => {
      return {
        label: item.isyWizardDirective
      };
    });
  }

  /**
   * Fired on changes
   * @param changes Includes all DOM changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isVisible && this.isVisible) {
      if (changes.isVisible.currentValue === false) {
        this.resetWizard();
      }
    }
  }

  /**
   * Emits the current index
   */
  emitIndex(): void {
    this.stepperIndexChange.emit(this.index);
    this.indexChange.emit(this.index);
  }

  /**
   * Moves the wizard to the next position
   */
  next(): void {
    this.index++;
    this.emitIndex();
  }

  /**
   * Moves the wizard to the previous position
   */
  previous(): void {
    this.index--;
    this.emitIndex();
  }

  /**
   * Is closing the dialog
   */
  closeDialog(): void {
    this.resetWizard();
    this.close();
  }

  /**
   * Is resetting the wizard position
   */
  private resetWizard(): void {
    this.index = 0;
  }

  /**
   * Is closing the wizard
   */
  private close(): void {
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
  }

  /**
   * Informs about the save action
   */
  save(): void {
    this.savingChange.emit(true);
  }
}
