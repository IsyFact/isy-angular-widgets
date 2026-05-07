import {AfterViewInit, Component, DestroyRef, inject} from '@angular/core';
import {ToastMessageOptions, MessageService} from 'primeng/api';
import {messageData} from '../../data/file-option';
import {MessageModule} from 'primeng/message';
import {ButtonModule} from 'primeng/button';
import {ToastModule} from 'primeng/toast';
import {AnchorNavigationService} from '../../../../shared/services/anchor-navigation.service';
import {SectionHeadingComponent} from '../../../../shared/components/section-heading/section-heading.component';

@Component({
  standalone: true,
  selector: 'demo-primeng-messages',
  templateUrl: './primeng-messages.component.html',
  imports: [MessageModule, ButtonModule, ToastModule, SectionHeadingComponent]
})
export class PrimengMessagesComponent implements AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly anchorNav = inject(AnchorNavigationService);
  messageService = inject(MessageService);

  messages: ToastMessageOptions[] = messageData;

  ngAfterViewInit(): void {
    this.anchorNav.initFragmentScroll(this.destroyRef);
  }

  scrollToWidget(event: MouseEvent, anchor: string): void {
    this.anchorNav.scrollToAnchor(event, anchor);
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
