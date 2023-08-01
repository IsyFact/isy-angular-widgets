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
  @Input() datentyp?: Datentyp;

  /**
   * Is getting fired on mouse up event
   * @param event the fired mouse event
   */
  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    this.inputMousePosition = this.getInputMousePosition(event);
  }

  /**
   * Is getting fired on keyboard event
   * @param event the fired keyboard event
   */
  @HostListener('keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    this.inputMousePosition = this.getInputMousePosition(event);
  }

  /**
   * The current mouse position (index) inside the input
   */
  inputMousePosition: number = 0;

  componentRef!: ComponentRef<InputCharComponent>;

  htmlInputElement!: HTMLInputElement;

  constructor(private viewContainerRef: ViewContainerRef, private element: ElementRef) {
    this.htmlInputElement = this.element.nativeElement as HTMLInputElement;
    this.htmlInputElement.style.width = 'calc(100% - 2.357rem)';
  }

  ngOnInit(): void {
    this.componentRef = this.viewContainerRef.createComponent(InputCharComponent);
    this.componentRef.instance.datentyp = this.datentyp!;

    this.setupInputChar();
    
    this.componentRef.instance.valueChange.subscribe(zeichen => {
      this.htmlInputElement.value = this.buildInputValue(this.htmlInputElement.value, zeichen);
      this.setNextInputPosition();
      this.htmlInputElement.dispatchEvent(new Event('change', {}));
    });
  }

  setupInputChar(): void  {
    this.componentRef.setInput('isInputDisabled', this.htmlInputElement?.disabled);
 
    const observer = new MutationObserver(mutationList => {
      for (const mutation of mutationList) {
        const input = mutation.target as HTMLInputElement;
 
        if (mutation && mutation.attributeName === 'disabled') {
          if (input.disabled) {
            this.componentRef.instance.displayCharPicker = false;
            this.componentRef.setInput('isInputDisabled', true);
          } else {
            this.componentRef.setInput('isInputDisabled', false);
          }
        }
      }
    });

    observer.observe(this.htmlInputElement, {
      attributes: true
    });
  }

  getInputMousePosition(event: MouseEvent | KeyboardEvent): number {
    return (event.target as HTMLInputElement).selectionStart!;
  }

  setNextInputPosition(): void {
    this.inputMousePosition += 1;
  }

  buildInputValue(value: string, zeichen: string): string {
    const beforeZeichen = value.substring(0, this.inputMousePosition);
    const afterZeichen = value.substring(this.inputMousePosition);
    return `${beforeZeichen}${zeichen}${afterZeichen}`;
  }
}
