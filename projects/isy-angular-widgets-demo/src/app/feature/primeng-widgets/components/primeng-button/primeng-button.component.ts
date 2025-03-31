import {Component} from '@angular/core';
import {MenuItem} from 'primeng/api';

import {optionData} from '../../data/file-option';

@Component({
  selector: 'demo-primeng-button',
  templateUrl: './primeng-button.component.html',
  standalone: false
})
export class PrimengButtonComponent {
  options: MenuItem[] = optionData;
}
