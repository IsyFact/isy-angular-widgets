import {Directive, TemplateRef} from '@angular/core';

/**
 * @ignore
 */
@Directive({
  selector: '[isyInputCharDialogDirective]'
})
export class InputCharDialogDirective {
  constructor(public templateRef: TemplateRef<unknown>) { }
}
