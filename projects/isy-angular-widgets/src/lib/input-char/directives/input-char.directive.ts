import {Directive, ElementRef, HostListener, Input, OnInit, ViewContainerRef} from '@angular/core';
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

  constructor(private viewContainerRef: ViewContainerRef, private element: ElementRef) { }

  ngOnInit(): void {
    const componentRef = this.viewContainerRef.createComponent(InputCharComponent);
    componentRef.instance.datentyp = this.datentyp!;

    const subscription = componentRef.instance.valueChange.subscribe(zeichen => {
      const input = this.element.nativeElement as HTMLInputElement;
      input.value = this.buildInputValue(input.value, zeichen);
      this.setNextInputPosition();
      input.dispatchEvent(new Event('change', {}));
    });

    componentRef.onDestroy(() => {
      // needed for unsubscribe after multiple async (value change) listening
      subscription.unsubscribe();
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
