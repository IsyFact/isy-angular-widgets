import {Component, Directive, ElementRef, inject} from '@angular/core';
import {createComponentFactory, createHostFactory, Spectator, SpectatorHost} from '@ngneat/spectator';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {FormWrapperComponent} from './form-wrapper.component';
import {FormWrapperFieldDirective} from './form-wrapper-field.directive';
import {FORM_WRAPPER_FIELD_ADAPTER, FormWrapperFieldAdapter} from './form-wrapper-field-adapter';

@Component({
  standalone: true,
  selector: 'fake-custom-field',
  template: ''
})
class FakeCustomFieldComponent {}

@Directive({
  standalone: true,
  selector: 'fake-custom-field[isyFormWrapperField]',
  providers: [
    {
      provide: FORM_WRAPPER_FIELD_ADAPTER,
      useExisting: FakeCustomFieldAdapterDirective
    }
  ]
})
class FakeCustomFieldAdapterDirective implements FormWrapperFieldAdapter {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  setFieldId(id: string): void {
    this.elementRef.nativeElement.setAttribute('id', id);
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

describe('FormWrapperComponent', () => {
  let spectator: Spectator<FormWrapperComponent>;

  const createComponent = createComponentFactory({
    component: FormWrapperComponent,
    imports: [ReactiveFormsModule, FormWrapperFieldDirective]
  });

  const createRequiredProps = (): {
    label: string;
    fieldId: string;
    control: FormControl;
    validationMessages: {required: string};
  } => ({
    label: 'Required Label',
    fieldId: 'requiredField',
    control: new FormControl('', Validators.required),
    validationMessages: {required: 'Field is required'}
  });

  const createOptionalProps = (): {
    label: string;
    fieldId: string;
    control: FormControl;
    validationMessages: Record<string, never>;
  } => ({
    label: 'Optional Label',
    fieldId: 'optionalField',
    control: new FormControl(''),
    validationMessages: {}
  });

  describe('basic component behavior', () => {
    it('should create required component', () => {
      spectator = createComponent({props: createRequiredProps()});
      expect(spectator.component).toBeTruthy();
    });

    it('should create optional component', () => {
      spectator = createComponent({props: createOptionalProps()});
      expect(spectator.component).toBeTruthy();
    });

    it('should throw an error if control is not provided', () => {
      expect(() =>
        createComponent({
          props: {
            ...createOptionalProps(),
            control: undefined as unknown as FormControl
          }
        })
      ).toThrowError('control input is required and must be an instance of FormControl');
    });

    it('should display the label text', () => {
      spectator = createComponent({
        props: {
          ...createRequiredProps(),
          label: 'Test Label'
        }
      });

      const labelElement = spectator.query('label');
      expect(labelElement).toBeTruthy();
      expect(labelElement?.textContent).toContain('Test Label');
    });

    it('should use generated label id by default', () => {
      spectator = createComponent({props: createRequiredProps()});

      expect(spectator.component.computedLabelId).toBe('requiredField-label');

      const label = spectator.query('label');
      expect(label).toHaveAttribute('id', 'requiredField-label');
    });

    it('should use custom labelId when provided', () => {
      spectator = createComponent({
        props: {
          ...createRequiredProps(),
          labelId: 'custom-label-id'
        }
      });

      expect(spectator.component.computedLabelId).toBe('custom-label-id');

      const label = spectator.query('label');
      expect(label).toHaveAttribute('id', 'custom-label-id');
    });

    it('should generate error id from fieldId', () => {
      spectator = createComponent({props: createRequiredProps()});
      expect(spectator.component.errorId).toBe('requiredField-error');
    });
  });

  describe('required indicator', () => {
    it('should not include "*" if field is optional', () => {
      spectator = createComponent({props: createOptionalProps()});

      const label = spectator.query('label[for="optionalField"]') as HTMLElement;

      expect(label.textContent).toContain('Optional Label');
      expect(label.querySelector('span[aria-hidden="true"]')).toBeNull();
      expect(label.textContent).not.toContain('*');
    });

    it('should include an asterisk and visually hidden required text if field is required', async () => {
      spectator = createComponent({props: createRequiredProps()});

      spectator.detectChanges();
      await spectator.fixture.whenStable();
      spectator.detectChanges();

      const label = spectator.query('label[for="requiredField"]') as HTMLElement;

      expect(label.textContent).toContain('Required Label');
      expect(label.querySelector('span[aria-hidden="true"]')?.textContent?.trim()).toBe('*');
      expect(label.querySelector('.visually-hidden')?.textContent?.trim()).toBe('Pflichtfeld');
    });

    it('should update the visually hidden required text when translations change', async () => {
      spectator = createComponent({props: createRequiredProps()});

      spectator.detectChanges();
      await spectator.fixture.whenStable();
      spectator.detectChanges();

      expect(spectator.query('.visually-hidden')?.textContent?.trim()).toBe('Pflichtfeld');

      spectator.component.configService.setTranslation({
        formWrapper: {
          required: 'Required field'
        }
      });

      spectator.detectChanges();
      await spectator.fixture.whenStable();
      spectator.detectChanges();

      expect(spectator.query('.visually-hidden')?.textContent?.trim()).toBe('Required field');

      spectator.component.configService.setTranslation({
        formWrapper: {
          required: 'Pflichtfeld'
        }
      });
    });

    it('should still include required marker even if validationMessages change dynamically', async () => {
      spectator = createComponent({props: createRequiredProps()});

      spectator.detectChanges();
      await spectator.fixture.whenStable();
      spectator.detectChanges();

      let label = spectator.query('label[for="requiredField"]') as HTMLElement;
      expect(label.querySelector('span[aria-hidden="true"]')?.textContent?.trim()).toBe('*');

      spectator.setInput('validationMessages', {required: 'true'});
      spectator.detectChanges();
      await spectator.fixture.whenStable();
      spectator.detectChanges();

      label = spectator.query('label[for="requiredField"]') as HTMLElement;
      expect(label.querySelector('span[aria-hidden="true"]')?.textContent?.trim()).toBe('*');

      spectator.setInput('validationMessages', {});
      spectator.detectChanges();
      await spectator.fixture.whenStable();
      spectator.detectChanges();

      label = spectator.query('label[for="requiredField"]') as HTMLElement;
      expect(label.querySelector('span[aria-hidden="true"]')?.textContent?.trim()).toBe('*');
    });

    it('should return true for required when Validators.required is present', () => {
      spectator = createComponent({props: createRequiredProps()});
      expect(spectator.component.required).toBeTrue();
    });

    it('should return false for required when Validators.required is not present', () => {
      spectator = createComponent({props: createOptionalProps()});
      expect(spectator.component.required).toBeFalse();
    });

    it('should return true for required when Validators.requiredTrue is present', () => {
      spectator = createComponent({
        props: {
          ...createOptionalProps(),
          control: new FormControl(false, Validators.requiredTrue)
        }
      });

      expect(spectator.component.required).toBeTrue();
    });
  });

  describe('error message behavior', () => {
    it('should display the correct error message for validation failure', () => {
      spectator = createComponent({props: createRequiredProps()});

      const control = spectator.component.control;
      control.markAsTouched();
      control.updateValueAndValidity();
      spectator.detectChanges();

      const errorContainer = spectator.query('#requiredField-error');
      expect(errorContainer).toExist();
      expect(errorContainer).toHaveText('Field is required');
    });

    it('should not render error container when there are no validation errors', () => {
      spectator = createComponent({props: createRequiredProps()});

      const control = spectator.component.control;
      control.setValue('some valid value');
      control.markAsTouched();
      control.updateValueAndValidity();
      spectator.detectChanges();

      expect(spectator.query('#requiredField-error')).toBeNull();
    });

    it('should show error if errorMessage exists, control is invalid and touched', () => {
      spectator = createComponent({props: createRequiredProps()});

      const control = spectator.component.control;
      control.markAsTouched();
      control.updateValueAndValidity();
      spectator.detectChanges();

      expect(spectator.component.showError).toBeTrue();
    });

    it('should show error if errorMessage exists, control is invalid and dirty', () => {
      spectator = createComponent({props: createRequiredProps()});

      const control = spectator.component.control;
      control.markAsDirty();
      control.updateValueAndValidity();
      spectator.detectChanges();

      expect(spectator.component.showError).toBeTrue();
    });

    it('should not show error when control is invalid but neither touched nor dirty', () => {
      spectator = createComponent({props: createRequiredProps()});

      const control = spectator.component.control;
      control.markAsPristine();
      control.markAsUntouched();
      control.setErrors({required: true});
      control.updateValueAndValidity();
      spectator.detectChanges();

      expect(control.touched).toBeFalse();
      expect(control.dirty).toBeFalse();
      expect(control.invalid).toBeTrue();
      expect(spectator.component.showError).toBeFalse();
      expect(spectator.query('#requiredField-error')).toBeNull();
    });

    it('should return null when control has no errors', () => {
      spectator = createComponent({
        props: {
          ...createRequiredProps(),
          control: new FormControl('valid value', Validators.required)
        }
      });

      expect(spectator.component.errorMessage).toBeNull();
    });

    it('should return fallback error message when control errors exist but no validation messages are defined', () => {
      spectator = createComponent({
        props: {
          ...createRequiredProps(),
          control: new FormControl('', Validators.required),
          validationMessages: {}
        }
      });

      expect(spectator.component.errorMessage).toBe('Ungültige Eingabe');
    });

    it('should return the correct error message when multiple validators fail', () => {
      spectator = createComponent({
        props: {
          ...createRequiredProps(),
          control: new FormControl('', [Validators.required, Validators.minLength(5)]),
          validationMessages: {
            required: 'Field is required',
            minlength: 'Minimum length is 5'
          }
        }
      });

      expect(spectator.component.errorMessage).toBe('Field is required');
    });

    it('should prioritize validation messages in the order they are defined', () => {
      spectator = createComponent({
        props: {
          ...createRequiredProps(),
          control: new FormControl('abc', [Validators.minLength(5), Validators.pattern(/^\d+$/)]),
          validationMessages: {
            pattern: 'Only digits allowed',
            minlength: 'Minimum length is 5'
          }
        }
      });

      expect(spectator.component.errorMessage).toBe('Only digits allowed');
    });

    it('should return first available configured error message when multiple validators fail', () => {
      spectator = createComponent({
        props: {
          ...createRequiredProps(),
          control: new FormControl('', [Validators.required, Validators.minLength(5)]),
          validationMessages: {
            required: 'Field is required'
          }
        }
      });

      expect(spectator.component.errorMessage).toBe('Field is required');
    });
  });

  describe('label css classes', () => {
    it('should set the ifta input correctly', () => {
      spectator = createComponent({props: createRequiredProps()});

      spectator.setInput('ifta', true);
      spectator.detectChanges();

      expect(spectator.component.ifta).toBeTrue();
    });

    it('should default the ifta input to false', () => {
      spectator = createComponent({props: createRequiredProps()});
      expect(spectator.component.ifta).toBeFalse();
    });

    it('should return "label--filled" when control has value and ifta is true', () => {
      spectator = createComponent({props: createRequiredProps()});

      spectator.component.control.setValue('test value');
      spectator.component.ifta = true;

      expect(spectator.component.labelFilledClass).toBe('label--filled');
    });

    it('should return empty string for labelFilledClass when control has no value', () => {
      spectator = createComponent({props: createRequiredProps()});

      spectator.component.control.setValue('');
      spectator.component.ifta = true;

      expect(spectator.component.labelFilledClass).toBe('');
    });

    it('should return empty string for labelFilledClass when ifta is false', () => {
      spectator = createComponent({props: createRequiredProps()});

      spectator.component.control.setValue('test value');
      spectator.component.ifta = false;

      expect(spectator.component.labelFilledClass).toBe('');
    });

    it('should return "ifta" class when ifta is true', () => {
      spectator = createComponent({props: createRequiredProps()});

      spectator.component.ifta = true;

      expect(spectator.component.labelOptionClass).toBe('ifta');
    });

    it('should return "static-label" class when ifta is false', () => {
      spectator = createComponent({props: createRequiredProps()});

      spectator.component.ifta = false;

      expect(spectator.component.labelOptionClass).toBe('static-label');
    });
  });
});

describe('FormWrapperComponent A11y integration - directive path', () => {
  let spectator: SpectatorHost<FormWrapperComponent>;
  let control: FormControl;

  const createHost = createHostFactory({
    component: FormWrapperComponent,
    imports: [ReactiveFormsModule, FormWrapperFieldDirective]
  });

  beforeEach(async () => {
    control = new FormControl('', Validators.required);

    spectator = createHost(
      `
        <isy-form-wrapper
          [label]="label"
          [fieldId]="fieldId"
          [control]="control"
          [validationMessages]="validationMessages"
          [describedbyId]="describedbyId"
          [labelId]="labelId"
          [ifta]="ifta"
        >
          <input isyFormWrapperField type="text" />
        </isy-form-wrapper>
      `,
      {
        hostProps: {
          label: 'Test Label',
          fieldId: 'testField',
          control,
          validationMessages: {required: 'Pflichtfeld'},
          describedbyId: undefined,
          labelId: undefined,
          ifta: false
        }
      }
    );

    spectator.detectChanges();
    await spectator.fixture.whenStable();
    spectator.detectChanges();
  });

  it('should set the projected field id to fieldId', () => {
    const input = spectator.query('input');
    expect(input).toHaveAttribute('id', 'testField');
  });

  it('should set the label for attribute to fieldId', () => {
    const label = spectator.query('label');
    expect(label).toHaveAttribute('for', 'testField');
  });

  it('should not set aria-describedby initially when no describedbyId and no error is shown', () => {
    const input = spectator.query('input');
    expect(input).not.toHaveAttribute('aria-describedby');
  });

  it('should set aria-describedby to describedbyId when provided', async () => {
    spectator.setHostInput('describedbyId', 'hint-id');
    spectator.detectChanges();
    await spectator.fixture.whenStable();
    spectator.detectChanges();

    const input = spectator.query('input');
    expect(input).toHaveAttribute('aria-describedby', 'hint-id');
  });

  it('should render the error container when error is shown after touched state change', async () => {
    control.markAsTouched();
    spectator.detectChanges();
    await spectator.fixture.whenStable();
    spectator.detectChanges();

    const errorContainer = spectator.query('#testField-error');
    expect(errorContainer).toExist();
    expect(errorContainer).toHaveText('Pflichtfeld');
  });

  it('should set aria-invalid and aria-errormessage when error is shown', async () => {
    control.markAsTouched();
    spectator.detectChanges();
    await spectator.fixture.whenStable();
    spectator.detectChanges();

    const input = spectator.query('input');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-errormessage', 'testField-error');
  });

  it('should set aria-describedby to errorId when error is shown and describedbyId is not set', async () => {
    control.markAsTouched();
    spectator.detectChanges();
    await spectator.fixture.whenStable();
    spectator.detectChanges();

    const input = spectator.query('input');
    expect(input).toHaveAttribute('aria-describedby', 'testField-error');
  });

  it('should include both describedbyId and errorId in aria-describedby when both exist', async () => {
    spectator.setHostInput('describedbyId', 'hint-id');
    control.markAsTouched();
    spectator.detectChanges();
    await spectator.fixture.whenStable();
    spectator.detectChanges();

    const input = spectator.query('input');
    expect(input).toHaveAttribute('aria-describedby', 'hint-id testField-error');
  });

  it('should remove aria-invalid and aria-errormessage when error is no longer shown', async () => {
    control.markAsTouched();
    spectator.detectChanges();
    await spectator.fixture.whenStable();
    spectator.detectChanges();

    let input = spectator.query('input');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-errormessage', 'testField-error');

    control.setValue('valid value');
    spectator.detectChanges();
    await spectator.fixture.whenStable();
    spectator.detectChanges();

    input = spectator.query('input');
    expect(input).not.toHaveAttribute('aria-invalid');
    expect(input).not.toHaveAttribute('aria-errormessage');
  });

  it('should keep describedbyId after error disappears', async () => {
    spectator.setHostInput('describedbyId', 'hint-id');
    spectator.detectChanges();
    await spectator.fixture.whenStable();
    spectator.detectChanges();

    control.markAsTouched();
    spectator.detectChanges();
    await spectator.fixture.whenStable();
    spectator.detectChanges();

    let input = spectator.query('input');
    expect(input).toHaveAttribute('aria-describedby', 'hint-id testField-error');

    control.setValue('valid value');
    spectator.detectChanges();
    await spectator.fixture.whenStable();
    spectator.detectChanges();

    input = spectator.query('input');
    expect(input).toHaveAttribute('aria-describedby', 'hint-id');
  });

  it('should remove aria-describedby when neither describedbyId nor error exists', async () => {
    spectator.setHostInput('describedbyId', 'hint-id');
    spectator.detectChanges();
    await spectator.fixture.whenStable();
    spectator.detectChanges();

    let input = spectator.query('input');
    expect(input).toHaveAttribute('aria-describedby', 'hint-id');

    spectator.setHostInput('describedbyId', undefined);
    spectator.detectChanges();
    await spectator.fixture.whenStable();
    spectator.detectChanges();

    input = spectator.query('input');
    expect(input).not.toHaveAttribute('aria-describedby');
  });

  it('should not show error for invalid control when it is untouched and not dirty', async () => {
    control.markAsPristine();
    control.markAsUntouched();
    control.setErrors({required: true});
    spectator.detectChanges();
    await spectator.fixture.whenStable();
    spectator.detectChanges();

    const input = spectator.query('input');
    expect(input).not.toHaveAttribute('aria-invalid');
    expect(input).not.toHaveAttribute('aria-errormessage');
    expect(input).not.toHaveAttribute('aria-describedby', 'testField-error');
    expect(spectator.query('#testField-error')).toBeNull();
  });

  it('should also show error when control is dirty', async () => {
    control.markAsDirty();
    spectator.detectChanges();
    await spectator.fixture.whenStable();
    spectator.detectChanges();

    const input = spectator.query('input');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-errormessage', 'testField-error');
    expect(input).toHaveAttribute('aria-describedby', 'testField-error');
    expect(spectator.query('#testField-error')).toExist();
  });
});

describe('FormWrapperComponent A11y integration - fallback path', () => {
  let spectator: SpectatorHost<FormWrapperComponent>;
  let control: FormControl;

  const createHost = createHostFactory({
    component: FormWrapperComponent,
    imports: [ReactiveFormsModule, FormWrapperFieldDirective]
  });

  beforeEach(async () => {
    control = new FormControl('', Validators.required);

    spectator = createHost(
      `
        <isy-form-wrapper
          [label]="label"
          [fieldId]="fieldId"
          [control]="control"
          [validationMessages]="validationMessages"
          [describedbyId]="describedbyId"
        >
          <input type="text" />
        </isy-form-wrapper>
      `,
      {
        hostProps: {
          label: 'Test Label',
          fieldId: 'fallbackField',
          control,
          validationMessages: {required: 'Pflichtfeld'},
          describedbyId: undefined
        }
      }
    );

    spectator.detectChanges();
    await spectator.fixture.whenStable();
    spectator.detectChanges();
  });

  it('should set the projected field id via fallback lookup', () => {
    const input = spectator.query('input');
    expect(input).toHaveAttribute('id', 'fallbackField');
  });

  it('should set aria-describedby via fallback lookup when describedbyId is provided', async () => {
    spectator.setHostInput('describedbyId', 'hint-id');
    spectator.detectChanges();
    await spectator.fixture.whenStable();
    spectator.detectChanges();

    const input = spectator.query('input');
    expect(input).toHaveAttribute('aria-describedby', 'hint-id');
  });

  it('should set fallback error attributes when error is shown', async () => {
    control.markAsTouched();
    spectator.detectChanges();
    await spectator.fixture.whenStable();
    spectator.detectChanges();

    const input = spectator.query('input');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-errormessage', 'fallbackField-error');
    expect(input).toHaveAttribute('aria-describedby', 'fallbackField-error');
    expect(spectator.query('#fallbackField-error')).toExist();
  });

  it('should remove fallback error attributes again when control becomes valid', async () => {
    control.markAsTouched();
    spectator.detectChanges();
    await spectator.fixture.whenStable();
    spectator.detectChanges();

    control.setValue('valid');
    spectator.detectChanges();
    await spectator.fixture.whenStable();
    spectator.detectChanges();

    const input = spectator.query('input');
    expect(input).not.toHaveAttribute('aria-invalid');
    expect(input).not.toHaveAttribute('aria-errormessage');
    expect(input).not.toHaveAttribute('aria-describedby');
    expect(spectator.query('#fallbackField-error')).toBeNull();
  });
});

describe('FormWrapperComponent control switching', () => {
  let spectator: SpectatorHost<FormWrapperComponent>;
  let firstControl: FormControl;
  let secondControl: FormControl;

  const createHost = createHostFactory({
    component: FormWrapperComponent,
    imports: [ReactiveFormsModule, FormWrapperFieldDirective]
  });

  beforeEach(async () => {
    firstControl = new FormControl('', Validators.required);
    secondControl = new FormControl('already valid', Validators.required);

    spectator = createHost(
      `
        <isy-form-wrapper
          [label]="label"
          [fieldId]="fieldId"
          [control]="control"
          [validationMessages]="validationMessages"
        >
          <input isyFormWrapperField type="text" />
        </isy-form-wrapper>
      `,
      {
        hostProps: {
          label: 'Test Label',
          fieldId: 'switchField',
          control: firstControl,
          validationMessages: {required: 'Pflichtfeld'}
        }
      }
    );

    spectator.detectChanges();
    await spectator.fixture.whenStable();
    spectator.detectChanges();
  });

  it('should react to a new control instance', async () => {
    firstControl.markAsTouched();
    spectator.detectChanges();
    await spectator.fixture.whenStable();
    spectator.detectChanges();

    expect(spectator.query('#switchField-error')).toExist();

    spectator.setHostInput('control', secondControl);
    spectator.detectChanges();
    await spectator.fixture.whenStable();
    spectator.detectChanges();

    expect(spectator.query('#switchField-error')).toBeNull();

    const input = spectator.query('input');
    expect(input).not.toHaveAttribute('aria-invalid');
    expect(input).not.toHaveAttribute('aria-errormessage');
  });

  it('should stop reacting to the previous control after switch', async () => {
    spectator.setHostInput('control', secondControl);
    spectator.detectChanges();
    await spectator.fixture.whenStable();
    spectator.detectChanges();

    firstControl.markAsTouched();
    firstControl.updateValueAndValidity();
    spectator.detectChanges();
    await spectator.fixture.whenStable();
    spectator.detectChanges();

    expect(spectator.query('#switchField-error')).toBeNull();

    secondControl.setValue('');
    secondControl.markAsTouched();
    secondControl.updateValueAndValidity();
    spectator.detectChanges();
    await spectator.fixture.whenStable();
    spectator.detectChanges();

    expect(spectator.query('#switchField-error')).toExist();
  });
});

describe('FormWrapperComponent custom adapter integration', () => {
  let spectator: SpectatorHost<FormWrapperComponent>;
  let control: FormControl;

  const createHost = createHostFactory({
    component: FormWrapperComponent,
    imports: [ReactiveFormsModule, FakeCustomFieldComponent, FakeCustomFieldAdapterDirective]
  });

  beforeEach(async () => {
    control = new FormControl('', Validators.required);

    spectator = createHost(
      `
        <isy-form-wrapper
          [label]="label"
          [fieldId]="fieldId"
          [control]="control"
          [validationMessages]="validationMessages"
          [describedbyId]="describedbyId"
        >
          <fake-custom-field isyFormWrapperField></fake-custom-field>
        </isy-form-wrapper>
      `,
      {
        hostProps: {
          label: 'Custom Label',
          fieldId: 'customField',
          control,
          validationMessages: {required: 'Pflichtfeld'},
          describedbyId: 'hint-id'
        }
      }
    );

    spectator.detectChanges();
    await spectator.fixture.whenStable();
    spectator.detectChanges();
  });

  it('should synchronize attributes through a custom field adapter', () => {
    const customField = spectator.query('fake-custom-field');

    expect(customField).toHaveAttribute('id', 'customField');
    expect(customField).toHaveAttribute('aria-describedby', 'hint-id');
    expect(customField).not.toHaveAttribute('aria-invalid');
    expect(customField).not.toHaveAttribute('aria-errormessage');
  });

  it('should update custom adapter attributes when error state changes', async () => {
    control.markAsTouched();
    spectator.detectChanges();
    await spectator.fixture.whenStable();
    spectator.detectChanges();

    const customField = spectator.query('fake-custom-field');

    expect(customField).toHaveAttribute('id', 'customField');
    expect(customField).toHaveAttribute('aria-invalid', 'true');
    expect(customField).toHaveAttribute('aria-errormessage', 'customField-error');
    expect(customField).toHaveAttribute('aria-describedby', 'hint-id customField-error');
    expect(spectator.query('#customField-error')).toExist();
  });
});
