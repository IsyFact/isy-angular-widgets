import {Component} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ButtonModule} from 'primeng/button';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmPopupModule} from 'primeng/confirmpopup';
import {DialogModule} from 'primeng/dialog';
import {DividerModule} from 'primeng/divider';
import {DrawerModule} from 'primeng/drawer';
import {InputTextModule} from 'primeng/inputtext';
import {PopoverModule} from 'primeng/popover';
import {ToastModule} from 'primeng/toast';

@Component({
  standalone: true,
  selector: 'demo-primeng-overlay',
  templateUrl: './primeng-overlay.component.html',
  imports: [
    ButtonModule,
    DrawerModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    ConfirmPopupModule,
    DividerModule,
    InputTextModule,
    PopoverModule
  ],
  providers: [ConfirmationService, MessageService]
})
export class PrimengOverlayComponent {
  constructor(
    readonly confirmationService: ConfirmationService,
    public messageService: MessageService
  ) {}

  visibleDialog: boolean = false;
  visibleSidebar: boolean = false;

  confirmDialog(event: Event): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      key: 'confirmDialog',
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.messageService.add({severity: 'success', summary: 'Confirmed', detail: 'You have accepted'});
      },
      reject: () => {
        this.messageService.add({severity: 'error', summary: 'Rejected', detail: 'You have rejected'});
      }
    });
  }

  confirmPopup(event: Event): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      key: 'confirmPopup',
      message: 'Are you sure you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({severity: 'info', summary: 'Confirmed', detail: 'You have accepted'});
      },
      reject: () => {
        this.messageService.add({severity: 'error', summary: 'Rejected', detail: 'You have rejected'});
      }
    });
  }

  showDialog(): void {
    this.visibleDialog = true;
  }

  closeDialog(): void {
    this.visibleDialog = false;
  }

  showSidebar(): void {
    this.visibleSidebar = true;
  }
}
