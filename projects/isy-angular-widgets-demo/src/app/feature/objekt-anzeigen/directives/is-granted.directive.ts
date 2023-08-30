import {Directive, Input, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {PermissionsManagerService} from '../services/permissions-manager.service';
import {PermissionType} from '../model/auth';

@Directive({
  selector: '[demoIsGranted]'
})
export class IsGrantedDirective implements OnInit {
  templateRefPermissions!: PermissionType;

  @Input() set demoIsGranted(permission: PermissionType) {
    // ToDo: Array, not single permission type
    this.isGranted(permission);
    this.templateRefPermissions = permission;
  }

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainerRef: ViewContainerRef,
    private permissionsManagerService: PermissionsManagerService
  ) {
  }

  ngOnInit(): void {
    this.permissionsManagerService.getPermissions().subscribe(val => {
      const availablePermissions = val.permissions.includes(this.templateRefPermissions, 0);
      this.updateView(availablePermissions);
    });
  }

  private isGranted(permission: PermissionType): void {
    const isGranted = this.permissionsManagerService.isGranted(permission);
    this.updateView(isGranted);
  }

  private updateView(condition: boolean): void {
    if (condition) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainerRef.clear();
    }
  }
}
