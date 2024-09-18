import {Component, OnDestroy} from '@angular/core';
import {
  contextMenuData,
  menuBarData,
  optionData,
  fileContainerData,
  tabMenuData,
  messageData
} from './data/file-option';
import {ConfirmationService, MegaMenuItem, MenuItem, Message, MessageService} from 'primeng/api';
import {personalData} from './data/organization';
import {StorageStatus} from './model/product';
import {electronicData, megaMenuProductData, storageData} from './data/product';
import {UploadEvent} from 'primeng/fileupload';
import {TerminalService} from 'primeng/terminal';
import {Subscription} from 'rxjs';

@Component({
  selector: 'demo-primeng-widgets',
  templateUrl: './primeng-widgets.component.html',
  styleUrl: './primeng-widgets.component.scss',
  providers: [ConfirmationService, MessageService, TerminalService]
})
export class PrimengWidgetsComponent implements OnDestroy {
  subscription: Subscription;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private terminalService: TerminalService
  ) {
    this.subscription = this.terminalService.commandHandler.subscribe((command) => {
      const response = command === 'date' ? new Date().toDateString() : 'Unknown command: ' + command;
      this.terminalService.sendResponse(response);
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  option: MenuItem[] = optionData;
  contextMenuOption: MenuItem[] = contextMenuData;
  menuBarOption: MenuItem[] = menuBarData;
  fileContainerOptions: MenuItem[] = fileContainerData;
  tabMenuOption: MenuItem[] = tabMenuData;
  messages: Message[] = messageData;

  stepItem: MenuItem[] = personalData;

  electronics: MenuItem[] = electronicData;
  storageStatus: StorageStatus[] = storageData;
  megaMenuOptions: MegaMenuItem[] = megaMenuProductData;

  visibleDialog: boolean = false;
  visibleSidebar: boolean = false;
  blockedContent: boolean = false;

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

  showToastMessage(): void {
    this.messageService.add({key: 'toast', severity: 'success', summary: 'Success', detail: 'Message Content'});
  }

  onUpload(event: UploadEvent): void {
    this.messageService.add({severity: 'info', summary: 'Success', detail: 'File Uploaded with Basic Mode'});
  }

  blockContent(): void {
    this.blockedContent = true;
  }

  unblockContent(): void {
    this.blockedContent = false;
  }
}
