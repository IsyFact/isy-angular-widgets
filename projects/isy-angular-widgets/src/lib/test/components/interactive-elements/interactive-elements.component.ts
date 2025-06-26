import {Component, Input} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {SelectModule} from 'primeng/select';
import {HauptfensterComponent} from '../../../hauptfenster/hauptfenster.component';
import {PanelModule} from 'primeng/panel';
import {TabsModule} from 'primeng/tabs';
import {InputTextModule} from 'primeng/inputtext';
import {InputCharDirective} from '../../../input-char/directives/input-char.directive';
import {FileUploadModule} from 'primeng/fileupload';
import {ToggleSwitchModule} from 'primeng/toggleswitch';
import {PanelMenuModule} from 'primeng/panelmenu';
import {MessageModule} from 'primeng/message';

@Component({
  standalone: true,
  selector: 'isy-test-component',
  imports: [
    ButtonModule,
    SelectModule,
    HauptfensterComponent,
    PanelModule,
    TabsModule,
    InputTextModule,
    InputCharDirective,
    FileUploadModule,
    ToggleSwitchModule,
    PanelMenuModule,
    MessageModule
  ],
  templateUrl: './interactive-elements.component.html'
})
export class TestComponentComponent {
  @Input() allowSidebarCollapse: boolean = true;
}
