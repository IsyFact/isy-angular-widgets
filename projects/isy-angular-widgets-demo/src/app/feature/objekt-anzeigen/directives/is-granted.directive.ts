import {Directive, Input, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {PermissionsManagerService} from '../services/permissions-manager.service';
import {PermissionType} from '../model/auth';

@Directive({
  selector: '[demoIsGranted]'
})
export class IsGrantedDirective implements OnInit {
  templateRefPermissions!: PermissionType[];

  @Input() set demoIsGranted(permission: PermissionType[]) {
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
    this.permissionsManagerService.getPermissionsBase().subscribe(permissionsOfEntity => {
      const arePermissionsAvailable = permissionsOfEntity.permissions.some(permission => this.templateRefPermissions.includes(permission));
      this.updateView(arePermissionsAvailable);
    });
  }

  private isGranted(permission: PermissionType[]): void {
    const arePermissionsAvailable = this.permissionsManagerService.isGranted(permission);
    this.updateView(arePermissionsAvailable);
  }

  private updateView(condition: boolean): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    condition ? this.viewContainerRef.createEmbeddedView(this.templateRef) : this.viewContainerRef.clear();
  }
}
