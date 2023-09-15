import {ComponentRef, Directive, ElementRef, HostListener, Input, OnInit, ViewContainerRef} from '@angular/core';
import {InputCharComponent} from '../components/input-char/input-char.component';
import {Datentyp} from '../model/datentyp';

/**
 * A directive to add to an <input> field to attach a special character picker.
 */
@Directive({
  selector: '[isyInputChar]'
})
export class InputCharDirective implements OnInit {

  /**
   * Determines which set of characters (datatype) according to DIN 91379 to show
   */
  @Input() datentyp: Datentyp = Datentyp.DATENTYP_C;

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

  constructor(private viewContainerRef: ViewContainerRef, private element: ElementRef) {
    this.htmlInputElement = this.element.nativeElement as HTMLInputElement;
    this.htmlInputElement.style.width = 'calc(100% - 2.357rem)';
  }

  ngOnInit(): void {
    this.componentRef = this.viewContainerRef.createComponent(InputCharComponent);
    this.componentRef.instance.datentyp = this.datentyp!;

    this.setupInputChar();

    this.componentRef.instance.insertCharacter.subscribe(zeichen => {
      this.htmlInputElement.value = this.buildInputValue(this.htmlInputElement.value, zeichen);
      this.setNextInputPosition(zeichen.length);
      this.htmlInputElement.dispatchEvent(new Event('change', {}));
    });
  }

  setupInputChar(): void  {
    this.componentRef.setInput('isInputDisabled', this.htmlInputElement.disabled || this.htmlInputElement.readOnly);

    const observer = new MutationObserver(mutationList => {
      for (const mutation of mutationList) {
        const input = mutation.target as HTMLInputElement;

        if (mutation && (mutation.attributeName === 'disabled' || mutation.attributeName === 'readonly')) {
          if (input.disabled || input.readOnly) {
            this.componentRef.instance.visible = false;
            this.componentRef.setInput('isInputDisabled', true);
          } else {
            this.componentRef.setInput('isInputDisabled', false);
          }
        }

        if (mutation && mutation.attributeName === 'ng-reflect-datentyp') {
          this.componentRef.setInput('datentyp', input.getAttribute('ng-reflect-datentyp'));
        }
      }
    });

    observer.observe(this.htmlInputElement, {
      attributes: true
    });
  }

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

  buildInputValue(value: string, zeichen: string): string {
    const beforeZeichen = value.substring(0, this.selectionPosition);
    const afterZeichen = value.substring(this.selectionPosition);
    return `${beforeZeichen}${zeichen}${afterZeichen}`;
  }
}
