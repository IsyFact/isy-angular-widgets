import {InjectionToken} from '@angular/core';

export interface FormWrapperFieldAdapter {
  setFieldId(id: string): void;
  setAriaDescribedBy(value: string | null): void;
  setAriaInvalid(value: 'true' | null): void;
  setAriaErrorMessage(value: string | null): void;
}

export const FORM_WRAPPER_FIELD_ADAPTER = new InjectionToken<FormWrapperFieldAdapter>('FORM_WRAPPER_FIELD_ADAPTER');
