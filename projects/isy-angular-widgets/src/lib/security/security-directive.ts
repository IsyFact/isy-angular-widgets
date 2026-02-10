import {Directive, inject, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {SecurityService} from './security-service';

/**
 * A structural directive similar to *ngIf (now `@if` block). Adds or removes HTML elements based on a permission check.
 * It takes the ID of a permission which is required to use the HTML-element.
 *
 * Usage: <div *isyPermitted="'permissionId'"></div>
 */
@Directive({
  selector: '[isyPermitted]'
})
export class SecurityDirective {
  /**
   * Represents an embedded template that can be used to instantiate embedded views.
   */
  private readonly template = inject<TemplateRef<unknown>>(TemplateRef);

  /**
   * Represents a container where one or more views can be attached to a component.
   */
  private readonly viewContainer = inject(ViewContainerRef);

  /**
   * A service that can be configured with permission configuration and return permissions for certain elements.
   */
  private readonly securityService = inject(SecurityService);

  /**
   * Shows the element if the corresponding permission is present
   * @param id The id of the corresponding permission
   */
  @Input() set isyPermitted(id: string) {
    if (id === undefined || id === null) {
      this.createOrClearView(true);
    } else {
      const decision = this.securityService.checkElementPermission(id);
      this.createOrClearView(decision);
    }
  }

  /**
   * Creates the embedded view or removes it.
   * @param shouldRender Whether the view should be rendered or not.
   */
  private createOrClearView(shouldRender: boolean): void {
    if (shouldRender) {
      this.viewContainer.createEmbeddedView(this.template);
    } else {
      this.viewContainer.clear();
    }
  }
}
