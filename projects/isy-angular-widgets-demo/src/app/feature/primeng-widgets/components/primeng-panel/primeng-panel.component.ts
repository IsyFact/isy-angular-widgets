import {Component} from '@angular/core';
import {MenuItem} from 'primeng/api';

import {optionData} from '../../data/file-option';

@Component({
  selector: 'demo-primeng-panel',
  templateUrl: './primeng-panel.component.html',
  standalone: false
})
export class PrimengPanelComponent {
  option: MenuItem[] = optionData;
}
