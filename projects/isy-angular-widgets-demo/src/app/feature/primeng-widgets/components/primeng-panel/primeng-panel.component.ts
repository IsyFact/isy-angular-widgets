import {Component} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {optionData} from '../../data/file-option';
import {AccordionModule} from 'primeng/accordion';
import {PanelModule} from 'primeng/panel';
import {TabsModule} from 'primeng/tabs';
import {DividerModule} from 'primeng/divider';
import {CardModule} from 'primeng/card';
import {FieldsetModule} from 'primeng/fieldset';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {SplitterModule} from 'primeng/splitter';
import {ToolbarModule} from 'primeng/toolbar';
import {ButtonModule} from 'primeng/button';
import {SplitButtonModule} from 'primeng/splitbutton';
import {StepperModule} from 'primeng/stepper';
import {InputIconModule} from 'primeng/inputicon';
import {InputTextModule} from 'primeng/inputtext';
import {IconFieldModule} from 'primeng/iconfield';

@Component({
  standalone: true,
  selector: 'demo-primeng-panel',
  templateUrl: './primeng-panel.component.html',
  imports: [
    AccordionModule,
    PanelModule,
    TabsModule,
    DividerModule,
    CardModule,
    FieldsetModule,
    ScrollPanelModule,
    SplitterModule,
    ToolbarModule,
    ButtonModule,
    SplitButtonModule,
    StepperModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule
  ]
})
export class PrimengPanelComponent {
  option: MenuItem[] = optionData;
}
