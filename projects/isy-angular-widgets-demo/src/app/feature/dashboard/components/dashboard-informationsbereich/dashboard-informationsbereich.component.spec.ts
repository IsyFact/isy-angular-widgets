import {DashboardInformationsbereichComponent} from './dashboard-informationsbereich.component';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {PanelMenu} from 'primeng/panelmenu';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {MockComponent} from 'ng-mocks';

describe('Integration Tests: DashboardInformationsbereichComponent', () => {
  let spectator: Spectator<DashboardInformationsbereichComponent>;
  const createdComponent = createComponentFactory({
    component: DashboardInformationsbereichComponent,
    declarations: [MockComponent(PanelMenu)],
    imports: [TranslateModule.forRoot()],
    providers: [TranslateService]
  });

  beforeEach(() => (spectator = createdComponent()));

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
