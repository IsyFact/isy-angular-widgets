import {Component, Directive, ElementRef, inject} from '@angular/core';
import {createHostFactory, SpectatorHost} from '@ngneat/spectator';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {FormWrapperComponent} from './form-wrapper.component';
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
