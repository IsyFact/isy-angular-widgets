import {Component, ElementRef, ViewChild, AfterViewInit, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Stepper, StepList, Step, StepPanels, StepPanel} from 'primeng/stepper';
import {Accordion, AccordionPanel, AccordionHeader, AccordionContent} from 'primeng/accordion';
import {Drawer} from 'primeng/drawer';
import {Popover} from 'primeng/popover';
import {Button} from 'primeng/button';
import {InputText} from 'primeng/inputtext';
import {MessageService} from 'primeng/api';
import {DividerModule} from 'primeng/divider';
import {FormWrapperComponent} from '@isy-angular-widgets/form-wrapper/form-wrapper.component';
import {TranslateModule} from '@ngx-translate/core';
import {FormControlPipe} from '@isy-angular-widgets/pipes/form-control.pipe';
import {SelectModule} from 'primeng/select';
import {initializedPerson} from '../objekt-anzeigen/data';

/**
 * Type guard function to determine if a given `AbstractControl` is a `FormGroup`.
 * @param control - The `AbstractControl` instance to check.
 * @returns `true` if the control is a `FormGroup`, otherwise `false`.
 */
function isFormGroup(control: AbstractControl): control is FormGroup {
  return typeof (control as FormGroup).controls === 'object';
}

/**
 * Recursively marks all controls in the given FormGroup as touched.
 *
 * This function iterates through each control in the provided FormGroup,
 * marks it as touched, and if the control is itself a FormGroup, recursively
 * applies the same operation to its child controls.
 * @param group - The FormGroup whose controls should be marked as touched.
 */
function markAllTouched(group: FormGroup): void {
  for (const control of Object.values(group.controls)) {
    control.markAsTouched();
    if (isFormGroup(control)) {
      markAllTouched(control);
    }
  }
  return;
}

/**
 * Attempts to focus the first element matching the given CSS selector.
 * @template T - The type of the HTMLElement to focus, defaults to HTMLElement.
 * @param selector - A CSS selector string to identify the element to focus.
 * @returns `true` if an element matching the selector was found and focused, otherwise `false`.
 */
function focusSelector<T extends HTMLElement = HTMLElement>(selector: string): boolean {
  const el = document.querySelector<T>(selector);
  if (el) {
    el.focus();
    return true;
  }
  return false;
}

enum StepperStep {
  First = 1,
  Second = 2,
  Third = 3
}

@Component({
  selector: 'demo-modalarme-patterns',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Stepper,
    StepList,
    Step,
    StepPanels,
    StepPanel,
    Accordion,
    AccordionPanel,
    AccordionHeader,
    AccordionContent,
    Drawer,
    Popover,
    Button,
    InputText,
    DividerModule,
    FormWrapperComponent,
    TranslateModule,
    FormControlPipe,
    SelectModule
  ],
  templateUrl: './modalarme-patterns.component.html'
})
export class ModalarmePatternsComponent implements AfterViewInit {
  private readonly fb = inject(FormBuilder);
  private readonly msg = inject(MessageService);

  // 1) Stepper (statt TabView/Tabs)
  // Aktiver Schritt (1..3) für p-stepper
  stepValue: StepperStep = StepperStep.First;
  globalError: string | null = null;

  person = initializedPerson;

  // Mehrschritt-Form (Stepper)
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

  goNext(
    target: StepperStep.First | StepperStep.Second | StepperStep.Third,
    currentGroup: FormGroup,
    activate: (val: number) => void
  ): void {
    if (currentGroup.valid) {
      this.globalError = null;
      activate(target);
    } else {
      this.globalError = 'Bitte korrigieren Sie die markierten Felder.';
      markAllTouched(currentGroup);
    }
    return;
  }

  // Zurück-Button im Stepper
  goBack(target: StepperStep.First | StepperStep.Second | StepperStep.Third, activate: (val: number) => void): void {
    activate(target);
    return;
  }

  // Final speichern (wird im Schritt 3 ausgelöst)
  saveStepper(): void {
    if (this.formStepper.invalid) {
      markAllTouched(this.formStepper);
      this.globalError = 'Bitte vervollständigen Sie alle Pflichtfelder.';
      return;
    }
    // persist
    this.globalError = null;
    this.msg.add({
      severity: 'success',
      summary: 'Gespeichert',
      detail: 'Objekt angelegt.'
    });
    return;
  }

  // 2) Drawer (Bearbeiten)
  drawerVisible = false;

  @ViewChild('drawerTrigger', {static: false, read: ElementRef})
  private drawerTriggerHost?: ElementRef<HTMLElement>;

  formEdit: FormGroup = this.fb.group({
    geburtsname: ['', Validators.required]
  });

  // 3) Confirm – Inline-Bar
  showConfirmBar = false;

  // 3b) Confirm – Popover
  @ViewChild('confirmTrigger', {static: false, read: ElementRef})
  private confirmTriggerHost?: ElementRef<HTMLElement>;

  @ViewChild('confirmPopover')
  confirmPopover?: Popover;

  // 4) Hilfe-Popover
  @ViewChild('helpBtn', {static: false, read: ElementRef})
  private helpBtnHost?: ElementRef<HTMLElement>;

  @ViewChild('helpPanelRoot')
  helpPanelRoot?: ElementRef<HTMLElement>;

  // 5) Fehlerhandling-Form
  formErrors: FormGroup = this.fb.group({
    geburtsname: ['', [Validators.required]]
  });

  // Lifecycle
  ngAfterViewInit(): void {
    // H1 nach Render fokusieren (A11y)
    setTimeout((): void => {
      const h1 = document.getElementById('demo-title');
      if (h1) {
        h1.focus();
      }
      return;
    }, 0);
    return;
  }

  // Validierungs-Helper
  invalid(group: 'base' | 'details', ctrl: string): boolean {
    const fg: FormGroup = group === 'base' ? this.baseFg : this.detailsFg;
    const c: AbstractControl | null = fg.get(ctrl);
    return !!(c && c.invalid && (c.dirty || c.touched));
  }

  // Drawer Aktionen
  openDrawer(): void {
    this.drawerVisible = true;
    return;
  }

  closeDrawer(): void {
    this.drawerVisible = false;
    return;
  }

  onDrawerShow(): void {
    setTimeout((): void => {
      const h = document.getElementById('edit-title');
      if (h) {
        h.focus();
      }
      return;
    }, 0);
    return;
  }

  private focusHostButton(host?: ElementRef<HTMLElement>): void {
    if (!host) {
      return;
    }
    const btn = host.nativeElement.querySelector('button');
    if (btn instanceof HTMLButtonElement) {
      btn.focus();
    }
    return;
  }

  onDrawerHide(): void {
    this.focusHostButton(this.drawerTriggerHost);
    return;
  }

  saveEdit(): void {
    if (this.formEdit.invalid) {
      return;
    }
    this.msg.add({
      severity: 'success',
      summary: 'Gespeichert',
      detail: 'Änderungen übernommen.'
    });
    this.closeDrawer();
    return;
  }

  // Confirm (Inline-Bar)
  askDeleteBar(): void {
    this.showConfirmBar = true;
    return;
  }

  cancelDeleteBar(): void {
    this.showConfirmBar = false;
    return;
  }

  confirmDeleteBar(): void {
    this.showConfirmBar = false;
    // delete
    this.msg.add({
      severity: 'warn',
      summary: 'Gelöscht',
      detail: 'Rückgängig per Aktion möglich.',
      life: 6000
    });
    return;
  }

  // Confirm (Popover)
  onConfirmPopoverShow(): void {
    setTimeout((): void => {
      focusSelector<HTMLButtonElement>('.overlay-confirm button');
      return;
    }, 0);
    return;
  }

  onConfirmPopoverHide(): void {
    this.focusHostButton(this.confirmTriggerHost);
    return;
  }

  confirmDeletePopover(): void {
    // delete
    this.msg.add({
      severity: 'warn',
      summary: 'Gelöscht',
      detail: 'Rückgängig über Aktionen möglich.',
      life: 6000
    });
    this.confirmPopover?.hide();
    return;
  }

  isHelpOpen = false;

  // Hilfe-Popover
  focusHelpPanel(): void {
    this.isHelpOpen = true;
    setTimeout((): void => {
      const el = this.helpPanelRoot?.nativeElement;
      if (el) {
        el.focus();
      }
      return;
    }, 0);
    return;
  }

  focusHelpTrigger(): void {
    this.isHelpOpen = false;
    this.focusHostButton(this.helpBtnHost);
    return;
  }

  // Fehlerhandling
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

      setTimeout((): void => {
        focusSelector('[aria-invalid="true"]');
        return;
      }, 0);
      return;
    }

    // speichern
    this.msg.add({
      severity: 'success',
      summary: 'Gespeichert',
      detail: 'Daten wurden gespeichert.'
    });
    return;
  }
}
