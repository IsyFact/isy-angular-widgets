import {Directive, ElementRef, inject} from '@angular/core';
import {FORM_WRAPPER_FIELD_ADAPTER, FormWrapperFieldAdapter} from './form-wrapper-field-adapter';

type FormWrapperFieldElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

@Directive({
  standalone: true,
  selector: `
    input[isyFormWrapperField],
    textarea[isyFormWrapperField],
    select[isyFormWrapperField]
  `,
  providers: [
    {
      provide: FORM_WRAPPER_FIELD_ADAPTER,
      useExisting: FormWrapperFieldDirective
    }
  ]
})
export class FormWrapperFieldDirective implements FormWrapperFieldAdapter {
  private readonly elementRef = inject<ElementRef<FormWrapperFieldElement>>(ElementRef);

  setFieldId(id: string): void {
    if (this.elementRef.nativeElement.id !== id) {
      this.elementRef.nativeElement.id = id;
    }
  }

  setAriaDescribedBy(value: string | null): void {
    this.setOrRemoveAttribute('aria-describedby', value);
  }

  setAriaInvalid(value: 'true' | null): void {
    this.setOrRemoveAttribute('aria-invalid', value);
  }

  setAriaErrorMessage(value: string | null): void {
    this.setOrRemoveAttribute('aria-errormessage', value);
  }

  private setOrRemoveAttribute(name: string, value: string | null): void {
    if (value) {
      this.elementRef.nativeElement.setAttribute(name, value);
    } else {
      this.elementRef.nativeElement.removeAttribute(name);
    }
  }
}
