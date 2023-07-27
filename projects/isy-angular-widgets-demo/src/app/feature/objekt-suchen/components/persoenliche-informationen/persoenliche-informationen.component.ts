import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';

/**
 * The component who is user for the demo presentation of the second screen of the wizard
 */
@Component({
  selector: 'demo-persoenliche-informationen',
  templateUrl: './persoenliche-informationen.component.html',
  styleUrls: ['./persoenliche-informationen.component.scss']
})
export class PersoenlicheInformationenComponent {
  /**
   * The internal form of the component
   */
  @Input() form!: FormGroup;
}
