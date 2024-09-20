import {Component, OnDestroy} from '@angular/core';
import {
  contextMenuData,
  menuBarData,
  optionData,
  fileContainerData,
  tabMenuData,
  messageData
} from './data/file-option';
import {MegaMenuItem, MenuItem, Message, MessageService} from 'primeng/api';
import {personalData} from './data/organization';
import {StorageStatus} from './model/product';
import {electronicData, megaMenuProductData, storageData} from './data/product';
import {TerminalService} from 'primeng/terminal';
import {Subscription} from 'rxjs';

@Component({
  selector: 'demo-primeng-widgets',
  templateUrl: './primeng-widgets.component.html',
  styleUrl: './primeng-widgets.component.scss',
  providers: [MessageService, TerminalService]
})
export class PrimengWidgetsComponent implements OnDestroy {
  subscription: Subscription;

  constructor(
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

  blockedContent: boolean = false;

  showToastMessage(): void {
    this.messageService.add({key: 'toast', severity: 'success', summary: 'Success', detail: 'Message Content'});
  }

  blockContent(): void {
    this.blockedContent = true;
  }

  unblockContent(): void {
    this.blockedContent = false;
  }
}
