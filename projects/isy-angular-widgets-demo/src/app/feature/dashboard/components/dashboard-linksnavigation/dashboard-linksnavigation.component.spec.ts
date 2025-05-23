import {DashboardLinksnavigationComponent} from './dashboard-linksnavigation.component';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {PanelMenu} from 'primeng/panelmenu';

describe('Integration Tests: DashboardLinksnavigationComponent', () => {
  let spectator: Spectator<DashboardLinksnavigationComponent>;
  const createComponent = createComponentFactory({
    component: DashboardLinksnavigationComponent,
    imports: [TranslateModule.forRoot(), PanelMenu],
    providers: [TranslateService]
  });

  beforeEach(() => (spectator = createComponent()));

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
    expect(spectator.component).toBeTruthy();
  });
});
