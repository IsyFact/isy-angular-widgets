import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {SecurityService} from './security-service';

/**
 * A structural directive similar to *ngIf (now @if block). Adds or removes HTML elements based on a permission check.
 * It takes the ID of a permission which is required to use the HTML-element.
 *
 * Usage: <div *isyPermitted="'permissionId'"></div>
 */
@Directive({
  selector: '[isyPermitted]'
})
export class SecurityDirective {
  /**
   * @param template Represents an embedded template that can be used to instantiate embedded views.
   * @param viewContainer Represents a container where one or more views can be attached to a component.
   * @param securityService A service that can be configured with permission configuration and return permissions for certain elements.
   * @internal
   */
  constructor(
    private readonly template: TemplateRef<unknown>,
    private readonly viewContainer: ViewContainerRef,
    private readonly securityService: SecurityService
  ) {}

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
