import {OnInit, Component, EventEmitter, Input, Output} from '@angular/core';
import {Person, Personalien} from '../../../../shared/model/person';
import {countries} from '../../country-data';

interface Column {
  field: string;
  header: string;
  type: string;
  inputFormating: boolean;
  currency?: [currencyCode: string, display: string];
}

@Component({
  selector: 'demo-result-list',
  templateUrl: './result-list.component.html'
})
export class ResultListComponent implements OnInit {
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

  cols!: Column[];
  selectedColumns!: Column[];

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

  ngOnInit(): void {
    this.cols = [
      {field: 'geschlecht', header: 'Geschlecht', type: 'text', inputFormating: false},
      {field: 'staatsangehoerigkeit', header: 'Nationalität', type: 'text', inputFormating: false},
      {field: 'geburtsdatum', header: 'Geburtsdatum', type: 'date', inputFormating: false},
      {field: 'bilanz', header: 'Bilanz', type: 'numeric', inputFormating: true, currency: ['EUR', 'symbol']}
    ];

    this.selectedColumns = this.cols;
  }

  emitEditAction(person?: Person): void {
    this.edit.emit(person);
  }

  emitCreateAction(): void {
    this.create.emit();
  }
}
