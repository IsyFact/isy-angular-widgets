import {AfterViewInit, Component, DestroyRef, Injector, afterNextRender, inject} from '@angular/core';
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
import {AnchorNavigationService} from '../../../../shared/services/anchor-navigation.service';
import {SectionHeadingComponent} from '../../../../shared/components/section-heading/section-heading.component';

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
    PopoverModule,
    SectionHeadingComponent
  ],
  providers: [ConfirmationService, MessageService]
})
export class PrimengOverlayComponent implements AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly anchorNav = inject(AnchorNavigationService);
  readonly confirmationService = inject(ConfirmationService);
  readonly messageService = inject(MessageService);
  private readonly injector = inject(Injector);

  visibleDialog = false;
  visibleSidebar = false;

  private lastDialogTrigger?: HTMLElement;
  private lastSidebarTrigger?: HTMLElement;
  private lastConfirmDialogTrigger?: HTMLElement;

  ngAfterViewInit(): void {
    this.anchorNav.initFragmentScroll(this.destroyRef);
  }

  scrollToWidget(event: MouseEvent, anchor: string): void {
    this.anchorNav.scrollToAnchor(event, anchor);
  }

  confirmDialog(event: Event): void {
    if (event.currentTarget instanceof HTMLElement) {
      this.lastConfirmDialogTrigger = event.currentTarget;
    }

    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
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

  onConfirmDialogHide(): void {
    const target = this.lastConfirmDialogTrigger;

    if (!target?.isConnected) {
      return;
    }

    afterNextRender(
      {
        write: () => target.focus()
      },
      {injector: this.injector}
    );
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

  showDialog(event: Event): void {
    if (event.currentTarget instanceof HTMLElement) {
      this.lastDialogTrigger = event.currentTarget;
    }

    this.visibleDialog = true;
  }

  closeDialog(): void {
    this.visibleDialog = false;
  }

  onDialogHide(): void {
    this.restoreFocus(this.lastDialogTrigger);
  }

  showSidebar(event: Event): void {
    if (event.currentTarget instanceof HTMLElement) {
      this.lastSidebarTrigger = event.currentTarget;
    }

    this.visibleSidebar = true;
  }

  onSidebarHide(): void {
    this.restoreFocus(this.lastSidebarTrigger);
  }

  private restoreFocus(target?: HTMLElement): void {
    if (!target?.isConnected) {
      return;
    }

    afterNextRender(
      {
        write: () => target.focus()
      },
      {injector: this.injector}
    );
  }
}
