import {Directive, Input, TemplateRef} from '@angular/core';

/**
 * To be used for each site of an isy-wizard.
 */
@Directive({
  selector: '[isyWizardDirective]'
})
export class WizardDirective {
  @Input() isyWizardDirective: string = '';

  constructor(public templateRef: TemplateRef<unknown>) {}
}
