import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  DestroyRef,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  FormControl,
  PristineChangeEvent,
  ReactiveFormsModule,
  StatusChangeEvent,
  TouchedChangeEvent,
  Validators,
  ValueChangeEvent
} from '@angular/forms';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ReplaySubject} from 'rxjs';
import {filter, startWith, switchMap} from 'rxjs/operators';
import {IftaLabelModule} from 'primeng/iftalabel';
import {MessageModule} from 'primeng/message';
import {WidgetsConfigService} from '../i18n/widgets-config.service';
import {FORM_WRAPPER_FIELD_ADAPTER, FormWrapperFieldAdapter} from './form-wrapper-field-adapter';

type FormWrapperFieldElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

/**
 * Wraps a form field together with its label, required marker, validation message and the
 * accessibility wiring between them. It is used with reactive forms and supports native fields
 * such as `input`, `textarea` and `select` as well as complex components through an adapter concept.
 *
 * Required inputs are `label`, `fieldId` and `control`.
 *
 * ## Native fields
 *
 * Marking the field with `isyFormWrapperField` is recommended. The wrapper then maintains `id`,
 * `aria-describedby`, `aria-invalid` and `aria-errormessage` automatically. Without the directive
 * the wrapper falls back to searching for a native `input`, `textarea` or `select` in its content.
 *
 * ## Complex components
 *
 * Complex components such as `p-select` are not covered by the native fallback. Either the
 * component manages accessibility itself, or a dedicated adapter directive is provided.
 * @example
 * A native field with validator specific messages:
 * ```html
 * <form [formGroup]="myForm">
 *   <isy-form-wrapper
 *     label="E-Mail"
 *     fieldId="email"
 *     [control]="myForm.controls.email | formControl"
 *     [validationMessages]="{
 *       required: 'E-Mail ist erforderlich',
 *       email: 'Bitte geben Sie eine gültige E-Mail-Adresse ein'
 *     }"
 *   >
 *     <input isyFormWrapperField type="email" pInputText formControlName="email" />
 *   </isy-form-wrapper>
 * </form>
 * ```
 * @example
 * A complex component wired up manually:
 * ```html
 * <isy-form-wrapper
 *   label="Geschlecht"
 *   labelId="label-gender"
 *   fieldId="gender"
 *   [control]="form.controls.gender | formControl"
 * >
 *   <p-select
 *     inputId="gender"
 *     ariaLabelledBy="label-gender"
 *     formControlName="gender"
 *     [options]="genderOptions"
 *   ></p-select>
 * </isy-form-wrapper>
 * ```
 */
@Component({
  standalone: true,
  selector: 'isy-form-wrapper',
  templateUrl: './form-wrapper.component.html',
  styleUrls: ['./form-wrapper.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, IftaLabelModule, MessageModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormWrapperComponent implements OnInit, OnChanges, AfterContentInit {
  /** Visible label of the form field. */
  @Input({required: true}) label!: string;
  /** Custom id for the label element. Falls back to `<fieldId>-label` when not set. */
  @Input() labelId?: string;
  /** Id of the wrapped form field. Used to link label, field and validation message. */
  @Input({required: true}) fieldId!: string;
  /** Id of an additional description or help text that is announced together with the field. */
  @Input() describedbyId?: string;
  /**
   * Validator specific error messages, keyed by the validation error name such as `required`.
   * The first matching entry in insertion order is displayed; without a match a generic
   * message from the {@link WidgetsConfigService} is used.
   */
  @Input() validationMessages: Record<string, string> = {};
  /** Renders the label as an in-field top-aligned label (PrimeNG IftaLabel) instead of a static label. */
  @Input() ifta = false;

  @ContentChild(FORM_WRAPPER_FIELD_ADAPTER, {read: FORM_WRAPPER_FIELD_ADAPTER})
  formFieldAdapter?: FormWrapperFieldAdapter;

  private readonly hostEl = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  readonly configService = inject(WidgetsConfigService);
  readonly requiredTranslation$ = this.configService.getTranslation$('formWrapper.required');

  private readonly controlSource = new ReplaySubject<FormControl<unknown>>(1);
  private _control!: FormControl<unknown>;

  @Input({required: true})
  set control(value: FormControl<unknown>) {
    if (!(value instanceof FormControl)) {
      throw new TypeError('control input is required and must be an instance of FormControl');
    }

    this._control = value;
    this.controlSource.next(value);
  }

  get control(): FormControl<unknown> {
    return this._control;
  }

  ngOnInit(): void {
    this.controlSource
      .pipe(
        switchMap((control) =>
          control.events.pipe(
            filter(
              (event) =>
                event instanceof ValueChangeEvent ||
                event instanceof StatusChangeEvent ||
                event instanceof TouchedChangeEvent ||
                event instanceof PristineChangeEvent
            ),
            startWith(null)
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.refreshView());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.fieldId || changes.describedbyId || changes.validationMessages || changes.ifta) {
      queueMicrotask(() => this.refreshView());
    }
  }

  ngAfterContentInit(): void {
    queueMicrotask(() => this.syncFieldAttributes());
  }

  get computedLabelId(): string {
    return this.labelId ?? `${this.fieldId}-label`;
  }

  get errorId(): string {
    return `${this.fieldId}-error`;
  }

  get errorMessage(): string | null {
    const errors = this.control.errors;
    if (!errors) {
      return null;
    }

    const preferredOrder = Object.keys(this.validationMessages);
    const matchingKey = preferredOrder.find((key) => errors[key] != null) ?? Object.keys(errors)[0];

    return matchingKey
      ? (this.validationMessages[matchingKey] ?? this.configService.getTranslation('formWrapper.invalid'))
      : null;
  }

  get labelOptionClass(): string {
    return this.ifta ? 'ifta' : 'static-label';
  }

  /**
   * Returns the CSS class for the label based on the value of the control.
   * If the control value is truthy, it returns 'label-filled',
   * otherwise it returns ''.
   * @returns The CSS class for the label.
   */
  get labelFilledClass(): string {
    return this.ifta && !!this.control.value ? 'label-filled' : '';
  }

  get showError(): boolean {
    return !!this.errorMessage && this.control.invalid && (this.control.touched || this.control.dirty);
  }

  get required(): boolean {
    return this.control.hasValidator(Validators.required) || this.control.hasValidator(Validators.requiredTrue);
  }

  get ariaDescribedBy(): string | null {
    const ids: string[] = [];

    if (this.describedbyId) {
      ids.push(this.describedbyId);
    }

    if (this.showError) {
      ids.push(this.errorId);
    }

    return ids.length > 0 ? ids.join(' ') : null;
  }

  get ariaInvalid(): 'true' | null {
    return this.showError ? 'true' : null;
  }

  get ariaErrorMessage(): string | null {
    return this.showError ? this.errorId : null;
  }

  private refreshView(): void {
    this.syncFieldAttributes();
    this.cdr.markForCheck();
  }

  private syncFieldAttributes(): void {
    if (this.formFieldAdapter) {
      this.formFieldAdapter.setFieldId(this.fieldId);
      this.formFieldAdapter.setAriaDescribedBy(this.ariaDescribedBy);
      this.formFieldAdapter.setAriaInvalid(this.ariaInvalid);
      this.formFieldAdapter.setAriaErrorMessage(this.ariaErrorMessage);
      return;
    }

    const field = this.resolveFallbackFieldElement();
    if (!field) {
      return;
    }

    if (field.id !== this.fieldId) {
      field.id = this.fieldId;
    }

    this.setOrRemoveAttribute(field, 'aria-describedby', this.ariaDescribedBy);
    this.setOrRemoveAttribute(field, 'aria-invalid', this.ariaInvalid);
    this.setOrRemoveAttribute(field, 'aria-errormessage', this.ariaErrorMessage);
  }

  private setOrRemoveAttribute(element: Element, name: string, value: string | null): void {
    if (value) {
      element.setAttribute(name, value);
    } else {
      element.removeAttribute(name);
    }
  }

  private resolveFallbackFieldElement(): FormWrapperFieldElement | null {
    const container = this.hostEl.nativeElement.querySelector('[data-form-wrapper-field-container]');
    if (!(container instanceof HTMLElement)) {
      return null;
    }

    const candidate: Element | null = container.querySelector('input, textarea, select');

    if (
      candidate instanceof HTMLInputElement ||
      candidate instanceof HTMLTextAreaElement ||
      candidate instanceof HTMLSelectElement
    ) {
      return candidate;
    }

    return null;
  }
}
