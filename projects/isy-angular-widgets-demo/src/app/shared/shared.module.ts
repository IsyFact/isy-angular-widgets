import {NgModule} from '@angular/core';
import {MessageService} from 'primeng/api';
import {PersonenService} from './services/personen.service';

@NgModule({
  imports: [],
  providers: [
    MessageService,
    PersonenService
  ]
})
export class SharedModule { }
