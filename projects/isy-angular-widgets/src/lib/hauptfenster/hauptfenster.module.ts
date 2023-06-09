import { NgModule } from '@angular/core';
import {HauptfensterComponent} from './hauptfenster.component';
import {MenubarModule} from 'primeng/menubar';
import {ButtonModule} from 'primeng/button';
import {CommonModule} from '@angular/common';
import {MegaMenuModule} from 'primeng/megamenu';

@NgModule({
  declarations: [
    HauptfensterComponent
  ],
  imports: [
    MenubarModule,
    ButtonModule,
    CommonModule,
    MegaMenuModule
  ],
  exports: [
    HauptfensterComponent
  ]
})
export class HauptfensterModule { }
