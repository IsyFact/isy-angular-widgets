import {AfterViewInit, Component, DestroyRef, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
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
import {OverlayBadgeModule} from 'primeng/overlaybadge';
import {InputTextModule} from 'primeng/inputtext';
import {AnchorNavigationService} from '../../../../shared/services/anchor-navigation.service';
import {SectionHeadingComponent} from '../../../../shared/components/section-heading/section-heading.component';

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
    TerminalModule,
    OverlayBadgeModule,
    InputTextModule,
    SectionHeadingComponent
  ],
  providers: [TerminalService]
})
export class PrimengMiscComponent implements AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly anchorNav = inject(AnchorNavigationService);
  private readonly terminalService = inject(TerminalService);

  blockedContent: boolean = false;
  storageStatus: StorageStatus[] = storageData;

  constructor() {
    this.terminalService.commandHandler.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((command) => {
      const response = command === 'date' ? new Date().toDateString() : 'Unknown command: ' + command;
      this.terminalService.sendResponse(response);
    });
  }

  ngAfterViewInit(): void {
    this.anchorNav.initFragmentScroll(this.destroyRef);
  }

  scrollToWidget(event: MouseEvent, anchor: string): void {
    this.anchorNav.scrollToAnchor(event, anchor);
  }

  blockContent(): void {
    this.blockedContent = true;
  }

  unblockContent(): void {
    this.blockedContent = false;
  }
}
