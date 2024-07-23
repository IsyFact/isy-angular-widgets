import {Directive, ElementRef, HostListener, OnInit} from '@angular/core';

@Directive({
  selector: '[isyFocusBlur]',
  standalone: true
})
export class FocusBlurDirective implements OnInit {
  private labelElement?: HTMLElement;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.labelElement = this.findPreviousLabel(this.el.nativeElement as HTMLElement);
    if (!this.labelElement) {
      throw new Error('No preceding label found for the input element.');
    }
  }

  @HostListener('focusin') onFocus(): void {
    if (this.labelElement) {
      this.labelElement.classList.add('focused-label');
    }
  }

  @HostListener('focusout') onBlur(): void {
    if (this.labelElement) {
      this.labelElement.classList.remove('focused-label');
    }
  }

  private findPreviousLabel(element: HTMLElement): HTMLElement {
    let sibling = element.previousElementSibling;
    while (sibling) {
      if (sibling.tagName.toLowerCase() === 'label') {
        return sibling as HTMLElement;
      }
      sibling = sibling.previousElementSibling;
    }

    let parent = element.parentElement;
    while (parent) {
      sibling = parent.previousElementSibling;
      while (sibling) {
        if (sibling.tagName.toLowerCase() === 'label') {
          return sibling as HTMLElement;
        }
        sibling = sibling.previousElementSibling;
      }
      parent = parent.parentElement;
    }
    return null as unknown as HTMLElement;
  }
}
