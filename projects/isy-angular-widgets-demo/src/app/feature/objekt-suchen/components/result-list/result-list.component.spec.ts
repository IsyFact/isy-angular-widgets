import {ResultListComponent} from './result-list.component';
import {TranslateTestingModule} from 'ngx-translate-testing';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {PanelModule} from 'primeng/panel';
import {TableModule} from 'primeng/table';
import {PersonenService} from '../../../../shared/services/personen.service';
import {FormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {Person} from '../../../../shared/model/person';
import {MultiSelectModule} from 'primeng/multiselect';

describe('Integration Tests: ResultListComponent', () => {
  let person: Person;
  let spectator: Spectator<ResultListComponent>;
  const createComponent = createComponentFactory({
    component: ResultListComponent,
    imports: [
      TranslateTestingModule.withTranslations({}),
      FormsModule,
      PanelModule,
      TableModule,
      ButtonModule,
      MultiSelectModule
    ]
  });

  beforeEach(() => {
    spectator = createComponent();
    const personenService = new PersonenService();
    person = personenService.generatePerson();
  });

  /**
   * Adds a click event listener to the given button
   * @param button The button who needs a click event
   * @param create Create action or not
   */
  function addClickEventListener(button: HTMLButtonElement, create: boolean): void {
    // Needed because events don't be triggered inside ng-template block for example onClick event handler
    button.addEventListener('click', function () {
      if (create) {
        spectator.component.emitCreateAction();
      } else {
        spectator.component.emitEditAction(person);
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

    expect(createActionSpy).toHaveBeenCalled();
  });

  it('should emit after edit action', () => {
    const editActionSpy = spyOn(spectator.component.edit, 'emit');
    setupPersonen();

    const editButton = spectator.query('#edit-button') as HTMLButtonElement;
    addClickEventListener(editButton, false);
    editButton.click();
    spectator.fixture.detectChanges();

    expect(editActionSpy).toHaveBeenCalledWith(person);
  });

  it('should have aria-label attribute on all p-sorticon elements', () => {
    const sortIcons = spectator.queryAll('p-sorticon');
    if (sortIcons.length > 0) {
      sortIcons.forEach((sortIcon) => {
        expect(sortIcon.hasAttribute('aria-label')).toBeTrue();
      });
    }
  });
});
