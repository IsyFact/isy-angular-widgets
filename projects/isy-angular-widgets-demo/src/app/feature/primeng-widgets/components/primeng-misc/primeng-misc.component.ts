import {Component, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {TerminalService} from 'primeng/terminal';

import {storageData} from '../../data/product';
import {StorageStatus} from '../../model/product';

@Component({
  selector: 'demo-primeng-misc',
  templateUrl: './primeng-misc.component.html',
  providers: [TerminalService],
  standalone: false
})
export class PrimengMiscComponent implements OnDestroy {
  blockedContent: boolean = false;
  storageStatus: StorageStatus[] = storageData;
  subscription: Subscription;

  constructor(public terminalService: TerminalService) {
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

  blockContent(): void {
    this.blockedContent = true;
  }

  unblockContent(): void {
    this.blockedContent = false;
  }
}
