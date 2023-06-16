import {Directive, TemplateRef} from '@angular/core';

/**
 * @internal
 */
@Directive({
  selector: '[isyInputCharDialogDirective]'
})
export class InputCharDialogDirective {
  constructor(public templateRef: TemplateRef<unknown>) { }
}
