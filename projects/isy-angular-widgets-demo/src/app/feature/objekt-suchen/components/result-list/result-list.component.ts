import {ChangeDetectorRef, OnInit, Component, EventEmitter, Input, Output} from '@angular/core';
import {Person, Personalien} from '../../../../shared/model/person';
import {countries} from '../../country-data';
import {PersonenService} from '../../../../shared/services/personen.service';

interface Column {
  field: string;
  header: string;
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

  constructor(
    private personService: PersonenService,
    private cd: ChangeDetectorRef
  ) {
    this.laender = countries;
  }

  ngOnInit() : void {
    void this.personService.getPersonsMini().then((person: Person) : void => {
      this.person = person;
      this.cd.markForCheck();
    });

    this.cols = [
      {field: 'geschlecht', header: 'Geschlecht'}
    ];

    this.selectedColumns = this.cols;
  };

  emitEditAction(person?: Person): void {
    this.edit.emit(person);
  }

  emitCreateAction(): void {
    this.create.emit();
  }
}
