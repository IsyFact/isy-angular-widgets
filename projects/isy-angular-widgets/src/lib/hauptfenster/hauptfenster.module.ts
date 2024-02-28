import {NgModule} from '@angular/core';
import {HauptfensterComponent} from './hauptfenster.component';
import {ButtonModule} from 'primeng/button';
import {CommonModule} from '@angular/common';
import {MegaMenuModule} from 'primeng/megamenu';
import {SeitenToolbarComponent} from '../seiten-toolbar/seiten-toolbar.component';

@NgModule({
  declarations: [HauptfensterComponent],
  exports: [HauptfensterComponent],
  imports: [ButtonModule, CommonModule, MegaMenuModule, SeitenToolbarComponent]
})
export class HauptfensterModule {}
