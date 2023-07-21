import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DialogModule} from 'primeng/dialog';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {RippleModule} from 'primeng/ripple';
import {FormsModule} from '@angular/forms';
import {MessageService} from 'primeng/api';
import {NotificationService} from './services/notification.service';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    RippleModule,
    FormsModule,
    TranslateModule
  ],
  providers: [
    NotificationService,
    MessageService
  ]
})
export class SharedModule { }
