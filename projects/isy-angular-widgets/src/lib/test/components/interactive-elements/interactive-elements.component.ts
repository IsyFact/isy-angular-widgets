import {Component, Input} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {HauptfensterComponent} from '../../../hauptfenster/hauptfenster.component';
import {MenuModule} from 'primeng/menu';
import {PanelModule} from 'primeng/panel';
import {TabsModule} from 'primeng/tabs';
import {InputTextModule} from 'primeng/inputtext';
import {InputCharDirective} from '../../../input-char/directives/input-char.directive';
import {FileUploadModule} from 'primeng/fileupload';
import {HttpClientModule} from '@angular/common/http';
import {InputSwitchModule} from 'primeng/inputswitch';

@Component({
  selector: 'isy-test-component',
  imports: [
    ButtonModule,
    DropdownModule,
    HauptfensterComponent,
    MenuModule,
    PanelModule,
    TabsModule,
    InputTextModule,
    InputCharDirective,
    FileUploadModule,
    HttpClientModule,
    InputSwitchModule
  ],
  templateUrl: './interactive-elements.component.html',
  standalone: true
})
export class TestComponentComponent {
  @Input() allowSidebarCollapse: boolean = true;
}
