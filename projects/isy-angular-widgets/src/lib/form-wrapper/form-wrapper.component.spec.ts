import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {ReactiveFormsModule, FormControl, Validators} from '@angular/forms';
import {FormWrapperComponent} from './form-wrapper.component';

describe('FormWrapperComponent', () => {
  let spectator: Spectator<FormWrapperComponent>;
  const createComponent = createComponentFactory({
    component: FormWrapperComponent,
    imports: [ReactiveFormsModule]
  });

  const defaultProps = {
    label: 'Test Label',
    fieldId: 'testField',
    control: new FormControl('', Validators.required),
    validationMessages: {required: 'Field is required'}
  };

  beforeEach(() => {
    spectator = createComponent({props: defaultProps});
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should display the label text', () => {
    const testLabel = 'Test Label';
    spectator.setInput('label', testLabel);
    spectator.setInput('control', new FormControl(''));
    spectator.detectChanges();
    const labelElement = spectator.query('label');
    expect(labelElement).toBeTruthy();
    expect(labelElement?.textContent).toContain(testLabel);
  });

  it('should display the correct error message for the validation failure', () => {
    const control = spectator.component.control;
    control.markAsTouched();
    control.setValue('');
    spectator.detectChanges();
    const errorMessage = spectator.query('.p-error');
    expect(errorMessage).toHaveText('Field is required');
  });

  it('should return null when there are no validation errors', () => {
    const control = spectator.component.control;
    control.setValue('some valid value');
    spectator.detectChanges();
    control.markAsTouched();
    control.updateValueAndValidity();
    const errorMessage = spectator.query('.p-error');
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
    spectator.component.validationMessages = {key: 'non_required'};
    spectator.detectChanges();

    const label = spectator.query('label[for="testField"]') as HTMLElement;
    expect(label.innerHTML).toEqual(defaultProps.label);
  });

  it('label should include a "*" if field is required', () => {
    spectator.component.validationMessages = {required: 'true'};
    spectator.detectChanges();

    const actual = `${defaultProps.label} *`;
    const label = spectator.query('label[for="testField"]') as HTMLElement;
    expect(label.innerHTML).toEqual(actual);
  });

  it('should set the ifta input correctly', () => {
    const iftaValue = true;
    spectator.setInput('ifta', iftaValue);
    spectator.detectChanges();
    expect(spectator.component.ifta).toEqual(iftaValue);
  });

  it('should default the ifta input to false', () => {
    expect(spectator.component.ifta).toEqual(false);
  });

  it('should return "label--filled" class when control has value and ifta is true', () => {
    spectator.component.control.setValue('test value');
    spectator.component.ifta = true;
    const labelClass = spectator.component.getLabelClassDynamic();
    expect(labelClass).toEqual(' label--filled');
  });

  it('should return "label--unfilled" class when control has no value and ifta is true', () => {
    spectator.component.control.setValue('');
    spectator.component.ifta = true;
    const labelClass = spectator.component.getLabelClassDynamic();
    expect(labelClass).toEqual(' label--unfilled');
  });

  it('should return "label--unfilled" class when control has value and ifta is false', () => {
    spectator.component.control.setValue('test value');
    spectator.component.ifta = false;
    const labelClass = spectator.component.getLabelClassDynamic();
    expect(labelClass).toEqual(' label--unfilled');
  });

  it('should return "label--unfilled" class when control has no value and ifta is false', () => {
    spectator.component.control.setValue('');
    spectator.component.ifta = false;
    const labelClass = spectator.component.getLabelClassDynamic();
    expect(labelClass).toEqual(' label--unfilled');
  });

  it('should return "ifta" class when ifta is true', () => {
    spectator.component.ifta = true;
    const labelClass = spectator.component.getLabelClass();
    expect(labelClass).toEqual(' ifta');
  });

  it('should return "static-label" class when ifta is false', () => {
    spectator.component.ifta = false;
    const labelClass = spectator.component.getLabelClass();
    expect(labelClass).toEqual(' static-label');
  });
});
