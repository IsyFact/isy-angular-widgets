import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Person, Personalien} from '../../../../shared/model/person';
import {ResultColumn, ResultState} from '../../model/result-column';
import {resultColumn, state, gender} from '../../data/result-column';

@Component({
  selector: 'demo-result-list',
  templateUrl: './result-list.component.html'
})
export class ResultListComponent {
  @Input() personen: Person[] = [];
  @Input() selectedObject?: Person;
  @Input() loading!: boolean;

  /**
   * An event emitter that informs about the creation of a new data record
   */
  @Output() edit = new EventEmitter<Person>();
  @Output() create = new EventEmitter<void>();
  @Output() objectSelected = new EventEmitter<Person>();
  @Output() addObjectPressed = new EventEmitter<void>();

  /**
   * The boolean that decides the active state of a panel tab
   */
  isCollapsed: boolean = false;

  personalien: Personalien[] = [];
  person!: Awaited<Person>;

  initialColumns: ResultColumn[] = [...resultColumn];
  selectedColumns: ResultColumn[] = [...resultColumn];
  gender: {gender: string}[] = [...gender];
  state: ResultState[] = [...state];

  emitEditAction(person?: Person): void {
    this.edit.emit(person);
  }

  emitCreateAction(): void {
    this.create.emit();
  }
}
