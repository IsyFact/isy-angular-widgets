import {NgModule} from '@angular/core';
import {HauptfensterComponent} from './hauptfenster.component';
import {ButtonModule} from 'primeng/button';
import {CommonModule} from '@angular/common';
import {MegaMenuModule} from 'primeng/megamenu';
import {SeitentoolbarComponent} from './components/seitentoolbar/seitentoolbar.component';

@NgModule({
  declarations: [HauptfensterComponent],
  exports: [HauptfensterComponent],
  imports: [ButtonModule, CommonModule, MegaMenuModule, SeitentoolbarComponent]
})
export class HauptfensterModule {}
