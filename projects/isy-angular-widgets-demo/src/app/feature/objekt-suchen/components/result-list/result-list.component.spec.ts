import {ResultListComponent} from './result-list.component';
import {TranslateTestingModule} from 'ngx-translate-testing';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {MockComponent} from 'ng-mocks';
import {Panel} from 'primeng/panel';
import {Table} from 'primeng/table';

describe('Integration Tests: ResultListComponent', () => {
  let spectator: Spectator<ResultListComponent>;
  const createdComponent = createComponentFactory({
    component: ResultListComponent,
    declarations: [MockComponent(Panel), MockComponent(Table)],
    imports: [TranslateTestingModule.withTranslations({})]
  });

  beforeEach(() => (spectator = createdComponent()));

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should not be selected by default', () => {
    expect(spectator.component.selectedObject).toBeUndefined();
  });
});
