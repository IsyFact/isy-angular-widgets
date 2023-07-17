import { NgModule } from '@angular/core';
import {HauptfensterComponent} from './hauptfenster.component';
import {MenubarModule} from 'primeng/menubar';
import {ButtonModule} from 'primeng/button';
import {CommonModule} from '@angular/common';
import {MegaMenuModule} from 'primeng/megamenu';
import {TranslateModule} from '@ngx-translate/core';
import {MenuTranslationService} from '../i18n/menu-translation.service';

@NgModule({
  declarations: [
    HauptfensterComponent
  ],
  imports: [
    MenubarModule,
    ButtonModule,
    CommonModule,
    MegaMenuModule,
    TranslateModule
  ],
  exports: [
    HauptfensterComponent
  ],
  providers: [
    MenuTranslationService
  ]
})
export class HauptfensterModule { }
