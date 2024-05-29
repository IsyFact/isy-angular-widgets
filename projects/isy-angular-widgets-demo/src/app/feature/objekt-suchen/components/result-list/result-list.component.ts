import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Person, Personalien} from '../../../../shared/model/person';
import {ResultColumn, ResultStatus} from '../../model/result-column';
import {resultColumn, status, gender} from '../../data/result-column';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';

@Component({
  selector: 'demo-result-list',
  templateUrl: './result-list.component.html'
})
export class ResultListComponent implements OnInit, OnDestroy {
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

  /**
   * The boolean that decides the active state of a panel tab
   */
  isCollapsed: boolean = false;

  personalien: Personalien[] = [];
  person!: Awaited<Person>;

  initialColumns: ResultColumn[] = [...resultColumn];
  selectedColumns: ResultColumn[] = [...this.initialColumns];
  translatedInitialColumns: ResultColumn[] = [];
  translatedSelectedColumns: ResultColumn[] = [];
  translatedStatus: ResultStatus[] = [];
  translatedGender: {gender: string}[] = [];

  gender = gender;
  status = status;

  private langChangeSubscription: Subscription;

  constructor(private translate: TranslateService) {
    this.langChangeSubscription = new Subscription();
  }

  private translateData(): void {
    [this.translatedInitialColumns, this.translatedSelectedColumns] = [this.initialColumns, this.selectedColumns].map(
      (columns) =>
        columns.map((option) => ({
          ...option,
          header: this.translate.instant(option.header) as string
        }))
    );

    this.translatedStatus = this.status.map((option) => ({
      ...option,
      label: this.translate.instant(option.label) as string,
      value: option.value
    }));

    this.translatedGender = this.gender.map((option) => ({
      ...option,
      gender: this.translate.instant(option.gender) as string
    }));
  }

  ngOnInit(): void {
    this.translateData();
    this.langChangeSubscription = this.translate.onLangChange.subscribe(this.translateData.bind(this));
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
