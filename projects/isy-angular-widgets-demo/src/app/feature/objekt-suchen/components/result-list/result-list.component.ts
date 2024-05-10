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

  //ToDo: Test for default value and on collapse
  /**
   * The boolean that decides the active state of a panel tab
   */
  isCollapsed: boolean = false;

  personalien: Personalien[] = [];
  geschlechter = [{geschlecht: 'm'}, {geschlecht: 'w'}, {geschlecht: 'x'}];
  stati = [
    {label: 'Unqualifiziert', value: 'Unqualifiziert'},
    {label: 'Qualifiziert', value: 'Qualifiziert'},
    {label: 'Neu', value: 'Neu'},
    {label: 'Verhandlung', value: 'Verhandlung'},
    {label: 'Erneuerung', value: 'Erneuerung'},
    {label: 'Vorschlag', value: 'Vorschlag'}
  ];

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
