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
import {WidgetsConfigService} from '../../../i18n/widgets-config.service';
import {CommonModule} from '@angular/common';
import {StepsModule} from 'primeng/steps';
import {DialogModule} from 'primeng/dialog';
import {ButtonModule} from 'primeng/button';

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
  imports: [CommonModule, StepsModule, DialogModule, ButtonModule],
  standalone: true
})
export class WizardComponent implements OnInit, AfterContentInit, OnChanges {
  /**
   * Stores the content that will be projected inside the template
   */
  @ContentChildren(WizardDirective) content?: QueryList<WizardDirective>;

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
  @Input() index: number = 0;

  /**
   * Breakpoint for PrimeNg dialog responsiveness
   */
  @Input() breaktpoints: {[key: string]: string} = {
    '3840px': '95vw',
    '1920px': '95vw',
    '1366px': '85vw',
    '768px': '95vw',
    '412px': '95vw'
  };

  /**
   * Stores the items of the wizard
   */
  items: MenuItem[] = [];

  constructor(public configService: WidgetsConfigService) {}

  /**
   * Fired on initialization
   */
  ngOnInit(): void {
    this.indexChange.subscribe(() => {
      this.stepperIndexChange.emit(this.index);
    });
    this.indexChange.emit(this.index);
  }

  /**
   * Fired after content initialization
   */
  ngAfterContentInit(): void {
    if (this.content) {
      this.items = this.content.map((item) => {
        return {
          label: item.isyWizardDirective
        };
      });
    }
  }

  /**
   * Fired on changes
   * @param changes Includes all DOM changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (this.isVisible && changes.isVisible?.currentValue === false) {
      this.resetWizard();
    }
  }

  /**
   * Moves the wizard to the next position
   */
  next(): void {
    this.index++;
    this.indexChange.emit(this.index);
  }

  /**
   * Moves the wizard to the previous position
   */
  previous(): void {
    this.index--;
    this.indexChange.emit(this.index);
  }

  /**
   * Is closing the dialog
   */
  closeDialog(): void {
    this.resetWizard();
    this.close();
  }

  /**
   * Resets the wizard position
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
