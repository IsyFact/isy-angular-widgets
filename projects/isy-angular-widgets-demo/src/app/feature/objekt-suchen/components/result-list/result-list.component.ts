import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Person, Personalien} from '../../../../shared/model/person';
import {ResultColumn, ResultFilter} from '../../model/result-column';
import {resultColumn, state, gender} from '../../data/result-column';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';

@Component({
  selector: 'demo-result-list',
  templateUrl: './result-list.component.html',
  standalone: false
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
  langChangeSubscription: Subscription;
  untranslatedinitialColumns: ResultColumn[] = [...resultColumn];
  selectedColumns: ResultColumn[] = [...resultColumn];
  initialColumns: ResultColumn[] = [];
  state: ResultFilter[] = [...state];
  gender: ResultFilter[] = [...gender];

  constructor(private readonly translate: TranslateService) {
    this.langChangeSubscription = new Subscription();
  }

  /**
   * Translates the data for the result list.
   * This method translates the initial columns, selected columns, gender filter, and state filter.
   */
  translateData(): void {
    this.initialColumns = this.translateColumns(this.untranslatedinitialColumns);
    this.selectedColumns = this.translateColumns(this.selectedColumns);
    this.gender = this.translateFilter(gender);
    this.state = this.translateFilter(state);
  }

  /**
   * Translates the columns of the result list.
   * @param columns - The array of ResultColumn objects to be translated.
   * @returns The translated array of ResultColumn objects.
   */
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

  /**
   * Translates the labels of the given ResultFilter array using the translation service.
   * @param value - The array of ResultFilter objects to be translated.
   * @returns The translated ResultFilter array.
   */
  translateFilter(value: ResultFilter[]): ResultFilter[] {
    return value.map((option) => ({
      ...option,
      label: this.translate.instant(option.label) as string
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
