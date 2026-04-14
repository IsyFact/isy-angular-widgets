import {createHostFactory, SpectatorHost} from '@ngneat/spectator';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {FormWrapperComponent} from './form-wrapper.component';
import {FormWrapperFieldDirective} from './form-wrapper-field.directive';

describe('FormWrapperFieldDirective integration', () => {
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
          <input isyFormWrapperField type="text" />
        </isy-form-wrapper>
      `,
      {
        hostProps: {
          label: 'Email',
          fieldId: 'email',
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

  it('should synchronize field attributes through the native adapter', () => {
    const input = spectator.query('input');

    expect(input).toHaveAttribute('id', 'email');
    expect(input).toHaveAttribute('aria-describedby', 'hint-id');
    expect(input).not.toHaveAttribute('aria-invalid');
    expect(input).not.toHaveAttribute('aria-errormessage');
  });

  it('should update synchronized field attributes when wrapper state changes', async () => {
    control.markAsTouched();
    spectator.detectChanges();
    await spectator.fixture.whenStable();
    spectator.detectChanges();

    const input = spectator.query('input');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-errormessage', 'email-error');
    expect(input).toHaveAttribute('aria-describedby', 'hint-id email-error');
  });
});
