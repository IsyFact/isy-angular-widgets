import {Component, inject} from '@angular/core';
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
export class PrimengMessagesComponent {
  messageService = inject(MessageService);

  messages: ToastMessageOptions[] = messageData;

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
