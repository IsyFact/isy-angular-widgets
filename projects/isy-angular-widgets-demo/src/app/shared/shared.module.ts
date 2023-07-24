import {NgModule} from '@angular/core';
import {MessageService} from 'primeng/api';
import {NotificationService} from './services/notification.service';
import {PersonenService} from './services/personen.service';

@NgModule({
  imports: [],
  providers: [
    NotificationService,
    MessageService,
    PersonenService
  ]
})
export class SharedModule { }
