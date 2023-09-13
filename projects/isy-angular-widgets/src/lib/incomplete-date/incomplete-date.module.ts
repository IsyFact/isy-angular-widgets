import {NgModule} from '@angular/core';
import {IncompleteDateComponent} from './incomplete-date.component';
import {FormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {InputMaskModule} from 'primeng/inputmask';

@NgModule({
  declarations: [
    IncompleteDateComponent
  ],
  imports: [
    FormsModule,
    InputTextModule,
    InputMaskModule
  ],
  exports: [
    IncompleteDateComponent
  ]
})
export class IncompleteDateModule {
}
