import {Directive, inject, TemplateRef} from '@angular/core';
import type {WizardFooterContext} from '../components/wizard/wizard.component';

/**
 * Marks a projected custom footer template for the wizard.
 */
@Directive({
  selector: 'ng-template[isyWizardFooter]'
})
export class WizardFooterDirective {
  readonly templateRef = inject<TemplateRef<WizardFooterContext>>(TemplateRef);
}
