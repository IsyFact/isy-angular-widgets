import {Component} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {optionData} from '../../data/file-option';
import {ButtonModule} from 'primeng/button';
import {DividerModule} from 'primeng/divider';
import {SplitButtonModule} from 'primeng/splitbutton';
import {SpeedDialModule} from 'primeng/speeddial';

@Component({
  standalone: true,
  selector: 'demo-primeng-button',
  templateUrl: './primeng-button.component.html',
  imports: [ButtonModule, DividerModule, SplitButtonModule, SpeedDialModule]
})
export class PrimengButtonComponent {
  options: MenuItem[] = optionData;
}
