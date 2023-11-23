import {DashboardLinksnavigationComponent} from './dashboard-linksnavigation.component';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {MockComponent} from 'ng-mocks';
import {PanelMenu} from 'primeng/panelmenu';

describe('Integration Tests: DashboardLinksnavigationComponent', () => {
  let spectator: Spectator<DashboardLinksnavigationComponent>;
  const createdComponent = createComponentFactory({
    component: DashboardLinksnavigationComponent,
    declarations: [MockComponent(PanelMenu)],
    imports: [TranslateModule.forRoot()],
    providers: [TranslateService]
  });

  beforeEach(() => (spectator = createdComponent()));

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
    expect(spectator.component).toBeTruthy();
  });
});
