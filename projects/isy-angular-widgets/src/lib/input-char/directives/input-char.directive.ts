import {
  ComponentRef,
  Directive,
  ElementRef,
  HostListener,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewContainerRef
} from '@angular/core';
import {Subscription} from 'rxjs';
import {InputCharComponent} from '../components/input-char/input-char.component';
import {Datentyp} from '../model/datentyp';
import {InputCharPickerService} from '../services/input-char-picker.service';

/**
 * A directive to add to an <input> field to attach a special character picker.
 */
@Directive({
  selector: '[isyInputChar]'
})
export class InputCharDirective implements OnInit, OnChanges, OnDestroy {
  /**
   * Determines which set of characters (datatype) according to DIN 91379 to show
   */
  @Input() datentyp: Datentyp = Datentyp.DATENTYP_C;

  /**
   * Determines whether the button is outlined
   */
  @Input() outlinedInputCharButton: boolean = false;

  /**
   * Is getting fired on mouse up event
   * @param event the fired mouse event
   */
  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    this.selectionPosition = this.getSelectionPosition(event);
  }

  /**
   * Is getting fired on keyboard event
   * @param event the fired keyboard event
   */
  @HostListener('keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    this.selectionPosition = this.getSelectionPosition(event);
  }

  /**
   * The current selection position (index) inside the input
   */
  selectionPosition: number = 0;

  componentRef!: ComponentRef<InputCharComponent>;

  htmlInputElement: HTMLInputElement;

  private attributeMutationObserver?: MutationObserver;

  private insertCharacterSubscription?: Subscription;

  private readonly viewContainerRef = inject(ViewContainerRef);

  private readonly element = inject(ElementRef);

  private readonly pickerService = inject(InputCharPickerService);

  constructor() {
    this.htmlInputElement = this.element.nativeElement as HTMLInputElement;
    this.htmlInputElement.style.width = 'calc(100% - 2.875rem)';
  }

  ngOnInit(): void {
    this.componentRef = this.viewContainerRef.createComponent(InputCharComponent);
    this.componentRef.setInput('datentyp', this.datentyp);
    this.componentRef.setInput('outlinedInputCharButton', this.outlinedInputCharButton);

    this.setupInputChar();

    this.insertCharacterSubscription = this.componentRef.instance.insertCharacter.subscribe((zeichen) => {
      this.htmlInputElement.value = this.buildInputValue(this.htmlInputElement.value, zeichen);
      this.setNextInputPosition(zeichen.length);
      this.htmlInputElement.dispatchEvent(new Event('input'));
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.componentRef) {
      return;
    }

    if (changes.datentyp) {
      this.componentRef.setInput('datentyp', this.datentyp);
    }

    if (changes.outlinedInputCharButton) {
      this.componentRef.setInput('outlinedInputCharButton', this.outlinedInputCharButton);
    }
  }

  ngOnDestroy(): void {
    // Disconnect the MutationObserver to avoid memory leaks
    this.attributeMutationObserver?.disconnect();
    this.insertCharacterSubscription?.unsubscribe();
    this.closeCharPicker();
  }

  /**
   * Sets up the input character directive.
   * This method updates the input disabled state and observes changes in the DOM using MutationObserver.
   */
  setupInputChar(): void {
    this.updateInputDisabledState();

    // Observe changes in disabled and readonly attributes of the input element.
    this.attributeMutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        const input = mutation.target as HTMLInputElement;

        this.handleDisabledReadonlyChange(input, mutation.attributeName);
      });
    });

    // Start observing the target element for attribute changes
    this.attributeMutationObserver.observe(this.htmlInputElement, {
      attributes: true,
      attributeFilter: ['disabled', 'readonly']
    });
  }

  /**
   * Updates the disabled state of the input element.
   */
  updateInputDisabledState(): void {
    const {disabled, readOnly} = this.htmlInputElement;
    this.componentRef.setInput('isInputDisabled', disabled || readOnly);
  }

  /**
   * Handles the change in disabled or readonly attribute of the input element.
   * @param input - The HTMLInputElement to handle.
   * @param attributeName - The name of the attribute that changed.
   */
  handleDisabledReadonlyChange(input: HTMLInputElement, attributeName: string | undefined | null): void {
    if (attributeName === 'disabled' || attributeName === 'readonly') {
      const isDisabledOrReadOnly = input.disabled || input.readOnly;
      this.closeCharPicker();
      this.componentRef.setInput('isInputDisabled', isDisabledOrReadOnly);
    }
  }

  /**
   * Retrieves the position of the current selection within an input element.
   * @param event - The MouseEvent or KeyboardEvent that triggered the selection.
   * @returns The position of the selection within the input element.
   */
  getSelectionPosition(event: MouseEvent | KeyboardEvent): number {
    return (event.target as HTMLInputElement).selectionStart!;
  }

  /**
   * Is setting the next input mouse position
   * @param charLength used to determine the exact next input mouse position, since there are characters longer than one position
   */
  setNextInputPosition(charLength: number): void {
    this.selectionPosition += charLength;
  }

  /**
   * Builds the input value by inserting a character at the current cursor position.
   * @param value - The original input value.
   * @param zeichen - The character to insert.
   * @returns The updated input value with the character inserted at the current cursor position.
   */
  buildInputValue(value: string, zeichen: string): string {
    const beforeZeichen = value.substring(0, this.selectionPosition);
    const afterZeichen = value.substring(this.selectionPosition);
    return `${beforeZeichen}${zeichen}${afterZeichen}`;
  }

  private closeCharPicker(): void {
    const hostElement = this.componentRef.location.nativeElement as HTMLElement;
    const button = hostElement.querySelector('button');

    if (!(button instanceof HTMLElement)) {
      return;
    }

    this.pickerService.closeFor(button);
  }
}
