import {Component, inject, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {TerminalModule, TerminalService} from 'primeng/terminal';
import {storageData} from '../../data/product';
import {StorageStatus} from '../../model/product';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {TagModule} from 'primeng/tag';
import {AvatarModule} from 'primeng/avatar';
import {BadgeModule} from 'primeng/badge';
import {DividerModule} from 'primeng/divider';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {ProgressBarModule} from 'primeng/progressbar';
import {MeterGroupModule} from 'primeng/metergroup';
import {SkeletonModule} from 'primeng/skeleton';
import {InplaceModule} from 'primeng/inplace';
import {ScrollTopModule} from 'primeng/scrolltop';
import {ButtonModule} from 'primeng/button';
import {BlockUIModule} from 'primeng/blockui';
import {PanelModule} from 'primeng/panel';

@Component({
  standalone: true,
  selector: 'demo-primeng-misc',
  templateUrl: './primeng-misc.component.html',
  imports: [
    AutoCompleteModule,
    TagModule,
    AvatarModule,
    BadgeModule,
    DividerModule,
    ProgressSpinnerModule,
    ProgressBarModule,
    MeterGroupModule,
    SkeletonModule,
    InplaceModule,
    ScrollTopModule,
    ButtonModule,
    BlockUIModule,
    PanelModule,
    TerminalModule
  ],
  providers: [TerminalService]
})
export class PrimengMiscComponent implements OnDestroy {
  blockedContent: boolean = false;
  storageStatus: StorageStatus[] = storageData;
  subscription: Subscription;

  terminalService = inject(TerminalService);

  constructor() {
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
