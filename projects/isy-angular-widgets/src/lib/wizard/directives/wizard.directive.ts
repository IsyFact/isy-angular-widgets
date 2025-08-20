import {Directive, inject, Input, TemplateRef} from '@angular/core';

/**
 * To be used for each site of an isy-wizard.
 */
@Directive({
  selector: '[isyWizardDirective]'
})
export class WizardDirective {
  @Input() isyWizardDirective: string = '';

  templateRef = inject<TemplateRef<unknown>>(TemplateRef);
}
