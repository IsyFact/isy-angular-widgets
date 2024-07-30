import {Component, Input} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {HauptfensterModule} from '../../../hauptfenster/hauptfenster.module';
import {MenuModule} from 'primeng/menu';
import {PanelModule} from 'primeng/panel';
import {TabViewModule} from 'primeng/tabview';
import {InputTextModule} from 'primeng/inputtext';
import {InputCharDirective} from '../../../input-char/directives/input-char.directive';
import {FileUploadModule} from 'primeng/fileupload';
import {HttpClientModule} from '@angular/common/http';
import {InputSwitchModule} from 'primeng/inputswitch';

@Component({
  selector: 'isy-test-component',
  standalone: true,
  imports: [
    ButtonModule,
    DropdownModule,
    HauptfensterModule,
    MenuModule,
    PanelModule,
    TabViewModule,
    InputTextModule,
    InputCharDirective,
    FileUploadModule,
    HttpClientModule,
    InputSwitchModule
  ],
  templateUrl: './interactive-elements.component.html'
})
export class TestComponentComponent {
  @Input() allowSidebarCollapse: boolean = true;
}
