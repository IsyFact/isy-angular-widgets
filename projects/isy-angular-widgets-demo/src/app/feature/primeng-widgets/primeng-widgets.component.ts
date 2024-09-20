import {Component, OnDestroy} from '@angular/core';
import {messageData} from './data/file-option';
import {Message, MessageService} from 'primeng/api';
import {StorageStatus} from './model/product';
import {storageData} from './data/product';
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

  messages: Message[] = messageData;

  storageStatus: StorageStatus[] = storageData;

  blockedContent: boolean = false;

  blockContent(): void {
    this.blockedContent = true;
  }

  unblockContent(): void {
    this.blockedContent = false;
  }
}
