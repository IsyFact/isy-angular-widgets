import {ResultListComponent} from './result-list.component';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {PanelModule} from 'primeng/panel';
import {TableModule} from 'primeng/table';
import {PersonenService} from '../../../../shared/services/personen.service';
import {FormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {Person} from '../../../../shared/model/person';
import {MultiSelectModule} from 'primeng/multiselect';
import {gender, state} from '../../data/result-column';

import {
  TranslateModule,
  TranslateLoader,
  TranslateNoOpLoader,
  TranslateService,
  provideTranslateService
} from '@ngx-translate/core';

describe('Integration Tests: ResultListComponent', () => {
  let person: Person;
  let spectator: Spectator<ResultListComponent>;
  const createComponent = createComponentFactory({
    component: ResultListComponent,
    imports: [TranslateModule, FormsModule, PanelModule, TableModule, ButtonModule, MultiSelectModule],
    providers: [provideTranslateService(), {provide: TranslateLoader, useClass: TranslateNoOpLoader}]
  });

  beforeEach(() => {
    spectator = createComponent();
    const translate = spectator.inject(TranslateService);
    translate.setTranslation('de', {}, true);
    translate.use('de');
    const personenService = new PersonenService();
    person = personenService.generatePerson();
  });

  /**
   * Adds a click event listener to the given button
   * @param button The button who needs a click event
   * @param create Create action or not
   */
  function addClickEventListener(button: HTMLButtonElement, create: boolean): void {
    button.addEventListener('click', (event) => {
      if (create) {
        spectator.component.emitCreateAction(event);
      } else {
        spectator.component.emitEditAction(person, event);
      }
    });
  }

  /**
   * Setting up the needed person input properties for the component usage
   */
  function setupPersonen(): void {
    spectator.component.personen = [person];
    spectator.component.selectedObject = person;
    spectator.component.loading = false;
  }

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should not be selected by default', () => {
    expect(spectator.component.selectedObject).toBeUndefined();
  });

  it('should emit after create action', () => {
    const createActionSpy = spyOn(spectator.component.create, 'emit');
    setupPersonen();

    const createButton = spectator.query('#create-button') as HTMLButtonElement;
    addClickEventListener(createButton, true);
    createButton.click();
    spectator.fixture.detectChanges();

    expect(createActionSpy).toHaveBeenCalledWith(jasmine.any(HTMLElement));
  });

  it('should emit after edit action', () => {
    const editActionSpy = spyOn(spectator.component.edit, 'emit');
    setupPersonen();

    const editButton = spectator.query('#edit-button') as HTMLButtonElement;
    addClickEventListener(editButton, false);
    editButton.click();
    spectator.fixture.detectChanges();

    expect(editActionSpy).toHaveBeenCalledWith({
      person,
      trigger: jasmine.any(HTMLElement)
    });
  });

  it('should have isCollapsed set to false by default', () => {
    expect(spectator.component.isCollapsed).toBeFalse();
  });

  it('should toggle isCollapsed to true when clicked', () => {
    const panelButton = spectator.query('.isy-demo-app-result-panel button.p-panel-toggle-button') as HTMLButtonElement;
    panelButton.click();
    spectator.fixture.detectChanges();
    expect(spectator.component.isCollapsed).toBeTrue();
  });

  it('should translate the data for the result list', () => {
    const translateColumnsSpy = spyOn(spectator.component, 'translateColumns').and.callThrough();
    const translateFilterSpy = spyOn(spectator.component, 'translateFilter').and.callThrough();
    spectator.component.translateData();
    expect(translateColumnsSpy).toHaveBeenCalledWith(spectator.component.untranslatedinitialColumns);
    expect(translateColumnsSpy).toHaveBeenCalledWith(spectator.component.selectedColumns);
    expect(translateFilterSpy).toHaveBeenCalledWith(gender);
    expect(translateFilterSpy).toHaveBeenCalledWith(state);
  });

  it('should exclude table actions and controls from print', () => {
    setupPersonen();
    spectator.detectChanges();

    const table = spectator.query('p-table.isy-print-table');
    const tableControls = spectator.query('.result-list-controls.isy-print-hide');
    const columnControls = spectator.queryAll('p-columnfilter, p-sorticon');
    const actionHeadings = spectator.queryAll('thead th.isy-print-hide');
    const actionCells = spectator.queryAll('tbody td.isy-print-hide');

    expect(table).toBeTruthy();
    expect(tableControls).toBeTruthy();
    expect(columnControls.length).toBeGreaterThan(0);
    expect(columnControls.every((control) => control.closest('.isy-print-hide'))).toBeTrue();
    expect(actionHeadings.length).toBe(1);
    expect(actionCells.length).toBe(1);
  });

  it('should keep fixed columns and the current optional column selection for print', () => {
    setupPersonen();
    spectator.component.selectedColumns = [spectator.component.initialColumns[0]];
    spectator.detectChanges();

    const printableHeadings = spectator.queryAll('thead th:not(.isy-print-hide)');
    const printableCells = spectator.queryAll('tbody tr:first-child td:not(.isy-print-hide)');

    expect(printableHeadings.length).toBe(4);
    expect(printableCells.length).toBe(4);
  });
});
