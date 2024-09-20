import {Component} from '@angular/core';
import {Message, MessageService} from 'primeng/api';

import {messageData} from '../../data/file-option';

@Component({
  selector: 'demo-primeng-messages',
  templateUrl: './primeng-messages.component.html',
  styleUrl: './primeng-messages.component.scss'
})
export class PrimengMessagesComponent {
  constructor(public messageService: MessageService) {}

  messages: Message[] = messageData;

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
