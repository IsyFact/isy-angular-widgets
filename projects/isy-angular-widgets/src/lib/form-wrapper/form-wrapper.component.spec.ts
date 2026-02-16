import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {ReactiveFormsModule, FormControl, Validators} from '@angular/forms';
import {FormWrapperComponent} from './form-wrapper.component';

describe('FormWrapperComponent', () => {
  let spectatorRequired: Spectator<FormWrapperComponent>;
  let spectatorOptional: Spectator<FormWrapperComponent>;
  const createComponent = createComponentFactory({
    component: FormWrapperComponent,
    imports: [ReactiveFormsModule]
  });

  const defaultRequiredProps = {
    label: 'Required Label',
    fieldId: 'requiredField',
    control: new FormControl('', Validators.required),
    validationMessages: {required: 'Field is required'}
  };

  const defaultProps = {
    label: 'Test Label',
    fieldId: 'testField',
    control: new FormControl(''),
    validationMessages: {}
  };

  beforeEach(() => {
    spectatorRequired = createComponent({props: defaultRequiredProps});
    spectatorOptional = createComponent({props: defaultProps});
  });

  it('should create required component', () => {
    expect(spectatorRequired.component).toBeTruthy();
  });

  it('should create optional component', () => {
    expect(spectatorOptional.component).toBeTruthy();
  });

  it('should display the label text', () => {
    const testLabel = 'Test Label';
    spectatorRequired.setInput('label', testLabel);
    spectatorRequired.setInput('control', new FormControl(''));
    spectatorRequired.detectChanges();
    const labelElement = spectatorRequired.query('label');
    expect(labelElement).toBeTruthy();
    expect(labelElement?.textContent).toContain(testLabel);
  });

  it('should display the correct error message for the validation failure', () => {
    const control = spectatorRequired.component.control;
    control.markAsTouched();
    control.setValue('');
    spectatorRequired.detectChanges();
    const errorMessage = spectatorRequired.query('.p-error');
    expect(errorMessage).toHaveText('Field is required');
  });

  it('should return null when there are no validation errors', () => {
    const control = spectatorRequired.component.control;
    control.setValue('some valid value');
    spectatorRequired.detectChanges();
    control.markAsTouched();
    control.updateValueAndValidity();
    const errorMessage = spectatorRequired.query('.p-error');
    expect(errorMessage).toBeNull();
  });

  it('should throw an error if formControl is not provided', () => {
    expect(() =>
      createComponent({
        props: {
          ...defaultProps,
          control: undefined
        }
      })
    ).toThrowError('control Input is required and must be an instance of FormControl');
  });

  it('label should not include a "*" by default if field is optional (non required)', () => {
    spectatorOptional.component.validationMessages = {key: 'non_required'};
    spectatorOptional.detectChanges();

    const label = spectatorOptional.query('label[for="testField"]') as HTMLElement;
    expect(label.innerHTML).not.toContain('*');
  });

  it('label should include an asterisk (*) if the field is required, even if the validation message is set dynamically', () => {
    const actual = `${defaultRequiredProps.label} *`;
    const label = spectatorRequired.query('label[for="requiredField"]') as HTMLElement;

    spectatorRequired.component.validationMessages = {required: 'true'};
    spectatorRequired.detectChanges();
    expect(label.innerHTML).toEqual(actual);

    spectatorRequired.component.validationMessages = {};
    spectatorRequired.detectChanges();
    expect(label.innerHTML).toEqual(actual);
  });

  it('should set the ifta input correctly', () => {
    const iftaValue = true;
    spectatorRequired.setInput('ifta', iftaValue);
    spectatorRequired.detectChanges();
    expect(spectatorRequired.component.ifta).toEqual(iftaValue);
  });

  it('should default the ifta input to false', () => {
    expect(spectatorRequired.component.ifta).toEqual(false);
  });

  it('should return "label--filled" class when control has value and ifta is true', () => {
    spectatorRequired.component.control.setValue('test value');
    spectatorRequired.component.ifta = true;
    const labelClass = spectatorRequired.component.labelFilledClass;
    expect(labelClass).toEqual(' label--filled');
  });

  it('should return "ifta" class when ifta is true', () => {
    spectatorRequired.component.ifta = true;
    const labelClass = spectatorRequired.component.labelOptionClass;
    expect(labelClass).toEqual(' ifta');
  });

  it('should return "static-label" class when ifta is false', () => {
    spectatorRequired.component.ifta = false;
    const labelClass = spectatorRequired.component.labelOptionClass;
    expect(labelClass).toEqual(' static-label');
  });

  it('should show error if errorMessage exists, control is invalid and touched', () => {
    const control = spectatorRequired.component.control;
    control.markAsTouched();
    control.setValue('');
    spectatorRequired.detectChanges();
    expect(spectatorRequired.component.shouldShowError()).toBeTrue();
  });

  it('should show error if errorMessage exists, control is invalid and dirty', () => {
    const control = spectatorRequired.component.control;
    control.markAsDirty();
    control.setValue('');
    spectatorRequired.detectChanges();
    expect(spectatorRequired.component.shouldShowError()).toBeTrue();
  });

  it('should return the correct error message when multiple validators fail', () => {
    const control = new FormControl('', [Validators.required, Validators.minLength(5)]);
    spectatorRequired.setInput('control', control);
    spectatorRequired.setInput('validationMessages', {
      required: 'Field is required',
      minlength: 'Minimum length is 5'
    });
    spectatorRequired.detectChanges();
    expect(spectatorRequired.component.errorMessage).toEqual('Field is required');
  });

  it('should return null when control has no errors', () => {
    const control = new FormControl('valid value', Validators.required);
    spectatorRequired.setInput('control', control);
    spectatorRequired.detectChanges();
    expect(spectatorRequired.component.errorMessage).toBeNull();
  });

  it('should return null when control errors exist but no validation messages are defined', () => {
    const control = new FormControl('', Validators.required);
    spectatorRequired.setInput('control', control);
    spectatorRequired.setInput('validationMessages', {});
    spectatorRequired.detectChanges();
    expect(spectatorRequired.component.errorMessage).toBeNull();
  });

  it('should prioritize validation messages in the order they are defined', () => {
    const control = new FormControl('abc', [Validators.minLength(5), Validators.pattern(/^\d+$/)]);

    spectatorRequired.setInput('control', control);
    spectatorRequired.setInput('validationMessages', {
      pattern: 'Only digits allowed',
      minlength: 'Minimum length is 5'
    });

    spectatorRequired.detectChanges();

    expect(spectatorRequired.component.errorMessage).toEqual('Only digits allowed');
  });

  it('should return first error message when validation message is not defined for that error', () => {
    const control = new FormControl('', [Validators.required, Validators.minLength(5)]);
    spectatorRequired.setInput('control', control);
    spectatorRequired.setInput('validationMessages', {
      required: 'Field is required'
    });
    spectatorRequired.detectChanges();
    expect(spectatorRequired.component.errorMessage).toEqual('Field is required');
  });
});
