import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Person, Personalien} from '../../../../shared/model/person';
import {countries} from '../../country-data';
import {ResultColumn} from '../../model/result-column';
import {resultColumn} from '../../data/result-column';

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
  person!: Awaited<Person>;

  initialColumns: ResultColumn[] = [];
  selectedColumns: ResultColumn[] = [];

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
    this.initialColumns = this.selectedColumns = [...resultColumn];
  }

  emitEditAction(person?: Person): void {
    this.edit.emit(person);
  }

  emitCreateAction(): void {
    this.create.emit();
  }
}
