import {DashboardLinksnavigationComponent} from './dashboard-linksnavigation.component';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {PanelMenu} from 'primeng/panelmenu';

describe('Integration Tests: DashboardLinksnavigationComponent', () => {
  let spectator: Spectator<DashboardLinksnavigationComponent>;
  const createdComponent = createComponentFactory({
    component: DashboardLinksnavigationComponent,
    imports: [TranslateModule.forRoot()],
    declarations: [PanelMenu],
    providers: [TranslateService]
  });

  beforeEach(() => spectator = createdComponent());

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
    expect(spectator.component).toBeTruthy();
  });
});
