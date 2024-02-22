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
});
