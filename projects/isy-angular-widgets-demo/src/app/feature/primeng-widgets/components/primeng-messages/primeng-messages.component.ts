import {AfterViewInit, Component, DestroyRef, inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ViewportScroller} from '@angular/common';
import {ToastMessageOptions, MessageService} from 'primeng/api';
import {messageData} from '../../data/file-option';
import {MessageModule} from 'primeng/message';
import {ButtonModule} from 'primeng/button';
import {ToastModule} from 'primeng/toast';

@Component({
  standalone: true,
  selector: 'demo-primeng-messages',
  templateUrl: './primeng-messages.component.html',
  imports: [MessageModule, ButtonModule, ToastModule]
})
export class PrimengMessagesComponent implements AfterViewInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly viewportScroller = inject(ViewportScroller);
  messageService = inject(MessageService);

  messages: ToastMessageOptions[] = messageData;

  ngAfterViewInit(): void {
    this.activatedRoute.fragment.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((fragment) => {
      if (fragment) {
        this.viewportScroller.scrollToAnchor(fragment);
      }
    });
  }

  scrollToWidget(event: MouseEvent, anchor: string): void {
    event.preventDefault();
    this.viewportScroller.scrollToAnchor(anchor);
    window.history.replaceState(
      window.history.state,
      '',
      `${window.location.pathname}${window.location.search}#${anchor}`
    );
  }

  showToastMessage(): void {
    this.messageService.add({
      key: 'toast',
      severity: 'success',
      summary: 'Success',
      detail: 'Message Content',
      sticky: true
    });
  }
}
