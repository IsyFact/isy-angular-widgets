import {
  Component,
  ElementRef,
  ViewChild,
  inject,
  HostListener,
  afterNextRender,
  Injector,
  ChangeDetectionStrategy
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {StepperModule} from 'primeng/stepper';
import {Accordion, AccordionPanel, AccordionHeader, AccordionContent} from 'primeng/accordion';
import {Popover} from 'primeng/popover';
import {Button} from 'primeng/button';
import {InputText} from 'primeng/inputtext';
import {MessageService} from 'primeng/api';
import {DividerModule} from 'primeng/divider';
import {FormWrapperComponent} from '@isy-angular-widgets/form-wrapper/form-wrapper.component';
import {TranslateModule} from '@ngx-translate/core';
import {FormControlPipe} from '@isy-angular-widgets/pipes/form-control.pipe';
import {SelectModule} from 'primeng/select';
import {MessageModule} from 'primeng/message';
import {ToastModule} from 'primeng/toast';

/**
 * Type guard: checks whether an AbstractControl is a FormGroup.
 * @param control - The AbstractControl to be checked
 * @returns true if the control is a FormGroup, otherwise false
 */
function isFormGroup(control: AbstractControl): control is FormGroup {
  return typeof (control as FormGroup).controls === 'object';
}

/**
 * Recursively marks all controls of a FormGroup as touched.
 * @param group - The FormGroup whose controls should be marked
 */
function markAllTouched(group: FormGroup): void {
  for (const control of Object.values(group.controls)) {
    control.markAsTouched();
    if (isFormGroup(control)) {
      markAllTouched(control);
    }
  }
}

enum StepperStep {
  First = 1,
  Second = 2,
  Third = 3
}

@Component({
  selector: 'demo-modalarme-patterns',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StepperModule,
    Accordion,
    AccordionPanel,
    AccordionHeader,
    AccordionContent,
    Popover,
    Button,
    InputText,
    DividerModule,
    FormWrapperComponent,
    TranslateModule,
    FormControlPipe,
    SelectModule,
    MessageModule,
    ToastModule
  ],
  templateUrl: './modalarme-patterns.component.html',
  styleUrls: ['./modalarme-patterns.component.scss']
})
export class ModalarmePatternsComponent {
  private readonly fb = inject(FormBuilder);
  private readonly msg = inject(MessageService);
  private readonly injector = inject(Injector);
  protected readonly Validators = Validators;

  // Stepper
  stepValue: StepperStep = StepperStep.First;
  globalError: string | null = null;

  formStepper: FormGroup = this.fb.nonNullable.group({
    base: this.fb.group({
      id: ['', Validators.required]
    }),
    details: this.fb.group({
      lastname: [''],
      firstname: [''],
      gender: ['']
    })
  });

  get baseFg(): FormGroup {
    return this.formStepper.get('base') as FormGroup;
  }

  get detailsFg(): FormGroup {
    return this.formStepper.get('details') as FormGroup;
  }

  goNext(target: StepperStep, currentGroup: FormGroup, activate: (val: number) => void): void {
    if (currentGroup.valid) {
      this.globalError = null;
      this.stepValue = target;
      activate(target);
    } else {
      this.globalError = 'Bitte korrigieren Sie die markierten Felder.';
      currentGroup.markAllAsTouched();
    }
  }

  goBack(target: StepperStep, activate: (val: number) => void): void {
    this.globalError = null;
    this.stepValue = target;
    activate(target);
  }

  saveStepper(): void {
    if (this.formStepper.invalid) {
      markAllTouched(this.formStepper);
      this.globalError = 'Bitte vervollständigen Sie alle Pflichtfelder.';
      return;
    }
    this.globalError = null;
    this.msg.add({
      severity: 'success',
      summary: 'Gespeichert',
      detail: 'Objekt angelegt.'
    });
  }

  /**
   * Checks whether a stepper field should be displayed as invalid.
   * @param group - The form group to check ('base' or 'details')
   * @param ctrl - The control name to check
   * @returns true if the control is invalid and dirty or touched, otherwise false
   */
  isStepFieldInvalid(group: 'base' | 'details', ctrl: string): boolean {
    const fg = group === 'base' ? this.baseFg : this.detailsFg;
    const c = fg.get(ctrl);
    return !!(c && c.invalid && (c.dirty || c.touched));
  }

  // Drawer
  private lastTrigger: HTMLElement | null = null;

  formEdit: FormGroup = this.fb.group({
    geburtsname: ['', Validators.required]
  });

  @ViewChild('panelTitle', {read: ElementRef})
  panelTitle?: ElementRef<HTMLElement>;

  panelOpen = false;

  openPanel(event: MouseEvent): void {
    if (event.currentTarget instanceof HTMLElement) {
      this.lastTrigger = event.currentTarget;
    }

    this.panelOpen = true;

    afterNextRender({write: () => this.panelTitle?.nativeElement.focus()}, {injector: this.injector});
  }

  closePanel(): void {
    this.panelOpen = false;
    this.restoreFocus();
  }

  saveEdit(): void {
    if (this.formEdit.invalid) {
      this.formEdit.markAllAsTouched();
      return;
    }
    this.closePanel();
  }

  /**
   * Global Escape handler only for the drawer.
   */
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (!this.panelOpen) return;
    this.closePanel();
  }

  private restoreFocus(): void {
    const target = this.lastTrigger;
    if (!target?.isConnected) return;

    afterNextRender({write: () => target.focus()}, {injector: this.injector});
  }

  // Confirm – Inline bar
  showConfirmBar = false;

  @ViewChild('deleteTrigger', {read: ElementRef})
  deleteTriggerRef?: ElementRef<HTMLElement>;

  @ViewChild('confirmDeleteBtn', {read: ElementRef})
  confirmDeleteBtnRef?: ElementRef<HTMLElement>;

  askDeleteBar(): void {
    if (this.showConfirmBar) return;

    this.showConfirmBar = true;
    this.focusAfterNextRender('confirm');
  }

  cancelDeleteBar(): void {
    this.showConfirmBar = false;
    this.focusAfterNextRender('trigger');
  }

  confirmDeleteBar(): void {
    this.showConfirmBar = false;

    this.msg.add({
      severity: 'warn',
      summary: 'Gelöscht',
      detail: 'Das Objekt wurde gelöscht.',
      life: 6000
    });

    this.focusAfterNextRender('trigger');
  }

  private focusAfterNextRender(target: 'trigger' | 'confirm'): void {
    afterNextRender(
      {
        write: () => {
          const host =
            target === 'confirm' ? this.confirmDeleteBtnRef?.nativeElement : this.deleteTriggerRef?.nativeElement;

          host?.querySelector<HTMLButtonElement>('button')?.focus();
        }
      },
      {injector: this.injector}
    );
  }

  // Error handling form
  @ViewChild('errorsFormEl', {read: ElementRef})
  private readonly errorsFormEl?: ElementRef<HTMLFormElement>;

  formErrors: FormGroup = this.fb.group({
    geburtsname: ['', [Validators.required]]
  });

  isInvalid(ctrl: string): boolean {
    const c = this.formErrors.get(ctrl);
    return !!(c && c.invalid && (c.dirty || c.touched));
  }

  submitErrors(): void {
    if (this.formErrors.invalid) {
      markAllTouched(this.formErrors);

      this.msg.add({
        severity: 'error',
        summary: 'Eingaben prüfen',
        detail: 'Bitte korrigieren Sie die markierten Felder.',
        life: 6000
      });

      afterNextRender(
        {
          read: () => {
            const firstInvalid = this.errorsFormEl?.nativeElement.querySelector<HTMLElement>('[aria-invalid="true"]');
            firstInvalid?.focus();
          }
        },
        {injector: this.injector}
      );

      return;
    }

    this.msg.add({
      severity: 'success',
      summary: 'Gespeichert',
      detail: 'Daten wurden gespeichert.',
      life: 4000
    });
  }
}
