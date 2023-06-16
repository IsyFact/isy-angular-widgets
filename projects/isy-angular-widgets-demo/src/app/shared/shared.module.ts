import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  DialogSachverhalteBearbeitenComponent
} from './components/dialog-sachverhalte-bearbeiten/dialog-sachverhalte-bearbeiten.component';
import {DialogModule} from 'primeng/dialog';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {RippleModule} from 'primeng/ripple';
import {FormsModule} from '@angular/forms';
import {MessageService} from 'primeng/api';
import {NotificationService} from './services/notification.service';
import { LocaleSwitcherComponent } from './components/locale-switcher/locale-switcher.component';

@NgModule({
  declarations: [
    DialogSachverhalteBearbeitenComponent,
    LocaleSwitcherComponent
  ],
  exports: [
    DialogSachverhalteBearbeitenComponent,
    LocaleSwitcherComponent
  ],
  imports: [
    CommonModule,
    DialogModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    RippleModule,
    FormsModule
  ],
  providers: [
    NotificationService,
    MessageService
  ]
})
export class SharedModule { }
