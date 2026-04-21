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

@Component({
  standalone: true,
  selector: 'isy-form-wrapper',
  templateUrl: './form-wrapper.component.html',
  styleUrls: ['./form-wrapper.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, IftaLabelModule, MessageModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormWrapperComponent implements OnInit, OnChanges, AfterContentInit {
  @Input({required: true}) label!: string;
  @Input() labelId?: string;
  @Input({required: true}) fieldId!: string;
  @Input() describedbyId?: string;
  @Input() validationMessages: Record<string, string> = {};
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

    return matchingKey ? (this.validationMessages[matchingKey] ?? 'Ungültige Eingabe') : null;
  }

  get labelOptionClass(): string {
    return this.ifta ? 'ifta' : 'static-label';
  }

  /**
   * Returns the CSS class for the label based on the value of the control.
   * If the control value is truthy, it returns 'label--filled',
   * otherwise it returns ''.
   * @returns The CSS class for the label.
   */
  get labelFilledClass(): string {
    return this.ifta && !!this.control.value ? 'label--filled' : '';
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
