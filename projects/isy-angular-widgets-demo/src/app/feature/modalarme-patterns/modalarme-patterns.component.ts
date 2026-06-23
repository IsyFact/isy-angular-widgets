import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  ViewChild,
  inject,
  HostListener,
  afterNextRender,
  Injector,
  ChangeDetectionStrategy
} from '@angular/core';
import {BreakpointObserver} from '@angular/cdk/layout';
import {CommonModule} from '@angular/common';
import {toSignal} from '@angular/core/rxjs-interop';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {LiveAnnouncer} from '@angular/cdk/a11y';
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
import {map} from 'rxjs';
import {AnchorNavigationService} from '../../shared/services/anchor-navigation.service';
import {SectionHeadingComponent} from '../../shared/components/section-heading/section-heading.component';

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

export enum StepperStep {
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
    ToastModule,
    SectionHeadingComponent
  ],
  templateUrl: './modalarme-patterns.component.html',
  styleUrls: ['./modalarme-patterns.component.scss']
})
export class ModalarmePatternsComponent implements AfterViewInit {
  private static readonly VERTICAL_STEPPER_MEDIA_QUERY = '(max-width: 320px)';

  private readonly destroyRef = inject(DestroyRef);
  private readonly anchorNav = inject(AnchorNavigationService);
  private readonly fb = inject(FormBuilder);
  private readonly msg = inject(MessageService);
  private readonly injector = inject(Injector);
  private readonly liveAnnouncer = inject(LiveAnnouncer);
  private readonly hostEl = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private pendingStepperFocus: StepperStep | null = null;

  protected readonly Validators = Validators;
  protected readonly isVerticalStepper = toSignal(
    this.breakpointObserver
      .observe(ModalarmePatternsComponent.VERTICAL_STEPPER_MEDIA_QUERY)
      .pipe(map(({matches}) => matches)),
    {
      initialValue: this.breakpointObserver.isMatched(ModalarmePatternsComponent.VERTICAL_STEPPER_MEDIA_QUERY)
    }
  );

  // Stepper
  stepValue: StepperStep = StepperStep.First;
  globalError: string | null = null;

  /**
   * Focuses the first field as soon as the active step panel has actually
   * created the field and PrimeNG has made it visible.
   */
  @ViewChild('stepperFocusTarget', {read: ElementRef})
  set stepperFocusTarget(target: ElementRef<HTMLElement> | undefined) {
    const pendingStep = this.pendingStepperFocus;

    if (!target || pendingStep === null || pendingStep !== this.stepValue) {
      return;
    }

    this.focusStepperTargetWhenReady(target.nativeElement, pendingStep);
  }

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

  goNext(target: StepperStep, currentGroup: FormGroup): void {
    if (currentGroup.valid) {
      this.globalError = null;
      this.pendingStepperFocus = target;
      this.stepValue = target;
      return;
    }

    currentGroup.markAllAsTouched();
    this.announceGlobalError('Bitte korrigieren Sie die markierten Felder.');
    this.focusFirstInvalidFieldInStep(this.stepValue);
  }

  goBack(target: StepperStep): void {
    this.globalError = null;
    this.pendingStepperFocus = target;
    this.stepValue = target;
  }

  saveStepper(): void {
    if (this.formStepper.invalid) {
      markAllTouched(this.formStepper);
      this.announceGlobalError('Bitte vervollständigen Sie alle Pflichtfelder.');
      this.focusFirstInvalidFieldInStep(this.stepValue);
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

  private announceGlobalError(message: string): void {
    this.globalError = message;
    void this.liveAnnouncer.announce(message, 'assertive');
  }

  private focusFirstInvalidFieldInStep(step: StepperStep): void {
    afterNextRender(
      {
        write: () => {
          const stepForm = this.hostEl.nativeElement.querySelector<HTMLElement>(`[data-step-form="${step}"]`);

          const invalidElement = stepForm?.querySelector<HTMLElement>(
            [
              'input[aria-invalid="true"]',
              'textarea[aria-invalid="true"]',
              'select[aria-invalid="true"]',
              '[role="combobox"][aria-invalid="true"]',
              '.p-select.p-invalid [role="combobox"]',
              '.p-invalid input',
              '.p-invalid textarea',
              '.p-invalid select',
              '.p-invalid [role="combobox"]'
            ].join(', ')
          );

          invalidElement?.focus();
        }
      },
      {injector: this.injector}
    );
  }

  /**
   * Waits until PrimeNG has mounted and displayed the target before focusing it.
   * @param element - Field that should receive focus
   * @param step - Step associated with the field
   * @param attempt - Current animation-frame attempt
   */
  private focusStepperTargetWhenReady(element: HTMLElement, step: StepperStep, attempt = 0): void {
    const maxAttempts = 60;

    requestAnimationFrame(() => {
      if (this.pendingStepperFocus !== step || this.stepValue !== step || !element.isConnected) {
        return;
      }

      const isVisible = element.getClientRects().length > 0;

      if (isVisible) {
        element.focus();

        if (element.ownerDocument.activeElement === element) {
          this.pendingStepperFocus = null;
          return;
        }
      }

      if (attempt < maxAttempts) {
        this.focusStepperTargetWhenReady(element, step, attempt + 1);
      }
    });
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

  // Popover
  @ViewChild('helpOverlay') helpOverlay!: Popover;

  helpOpen = false;
  helpPopoverId = 'help-popover-panel';

  ngAfterViewInit(): void {
    this.anchorNav.initFragmentScroll(this.destroyRef);
  }

  scrollToWidget(event: MouseEvent, anchor: string): void {
    this.anchorNav.scrollToAnchor(event, anchor);
  }

  toggleHelp(event: Event): void {
    this.helpOverlay.toggle(event);
  }

  closeHelp(): void {
    this.helpOverlay.hide();
  }

  onHelpShow(): void {
    this.helpOpen = true;
  }

  onHelpHide(): void {
    this.helpOpen = false;
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
