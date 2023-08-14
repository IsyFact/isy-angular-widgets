import {NgModule} from '@angular/core';
import {IncompleteDateComponent} from './incomplete-date.component';
import {FormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {IncompleteDateService} from './incomplete-date.service';

@NgModule({
  declarations: [
    IncompleteDateComponent
  ],
  imports: [
    FormsModule,
    InputTextModule
  ],
  exports: [
    IncompleteDateComponent
  ],
  providers: [
    IncompleteDateService
  ]
})
export class IncompleteDateModule {
}
