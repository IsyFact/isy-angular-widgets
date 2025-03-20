import {Component} from '@angular/core';
import {ToastMessageOptions, MessageService} from 'primeng/api';

import {messageData} from '../../data/file-option';

@Component({
  selector: 'demo-primeng-messages',
  templateUrl: './primeng-messages.component.html',
  standalone: false
})
export class PrimengMessagesComponent {
  constructor(public messageService: MessageService) {}

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
