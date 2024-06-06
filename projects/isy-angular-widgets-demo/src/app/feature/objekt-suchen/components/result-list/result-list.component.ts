import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Person, Personalien} from '../../../../shared/model/person';
import {ResultColumn, ResultState} from '../../model/result-column';
import {resultColumn, state, gender} from '../../data/result-column';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';

@Component({
  selector: 'demo-result-list',
  templateUrl: './result-list.component.html'
})
export class ResultListComponent implements OnInit, OnDestroy {
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

  untranslatedinitialColumns: ResultColumn[] = [...resultColumn];
  selectedColumns: ResultColumn[] = [...resultColumn];
  initialColumns: ResultColumn[] = [];
  state: ResultState[] = [...state];
  gender: {gender: string}[] = [...gender];

  langChangeSubscription: Subscription;

  constructor(private translate: TranslateService) {
    this.langChangeSubscription = new Subscription();
  }

  translateData(): void {
    this.initialColumns = this.translateColumns(this.untranslatedinitialColumns);
    this.selectedColumns = this.translateColumns(this.selectedColumns);
    this.gender = this.translateArray(gender, 'gender');
    this.state = this.translateArray(state, 'label');
  }

  translateColumns(columns: ResultColumn[]): ResultColumn[] {
    return columns
      .map((option) => {
        option.header = this.untranslatedinitialColumns.find((column) => column.field === option.field)
          ?.header as string;
        return option;
      })
      .map((column) => ({
        ...column,
        header: this.translate.instant(column.header) as string
      }));
  }

  translateArray<T>(array: T[], field: keyof T): T[] {
    return array.map((item) => ({
      ...item,
      [field]: this.translate.instant(item[field] as unknown as string) as unknown as T[keyof T]
    }));
  }

  ngOnInit(): void {
    this.translateData();
    this.langChangeSubscription = this.translate.onLangChange.subscribe(() => {
      this.translateData();
    });
  }

  ngOnDestroy(): void {
    this.langChangeSubscription.unsubscribe();
  }

  emitEditAction(person?: Person): void {
    this.edit.emit(person);
  }

  emitCreateAction(): void {
    this.create.emit();
  }
}
