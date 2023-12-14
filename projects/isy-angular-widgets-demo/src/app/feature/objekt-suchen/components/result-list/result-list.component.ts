import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Person, Personalien} from '../../../../shared/model/person';
import {countries} from '../../country-data';

@Component({
  selector: 'demo-result-list',
  templateUrl: './result-list.component.html'
})
export class ResultListComponent {
  @Input() personen: Person[] = [];
  @Input() selectedObject: Person | undefined;
  @Input() loading!: boolean;

  /**
   * An event emitter that informs about the creation of a new data record
   */
  @Output() edit = new EventEmitter<Person>();
  @Output() create = new EventEmitter<void>();
  @Output() objectSelected = new EventEmitter<Person>();
  @Output() addObjectPressed = new EventEmitter<void>();

  personalien: Personalien[] = [];
  geschlechter = ['m', 'w', 'x'];

  readonly laender: string[];

  constructor() {
    this.laender = countries;
  }

  emitEditAction(person?: Person): void {
    this.edit.emit(person);
  }

  emitCreateAction(): void {
    this.create.emit();
  }
}
