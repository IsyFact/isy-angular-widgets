import {DashboardLinksnavigationComponent} from './dashboard-linksnavigation.component';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
<<<<<<< HEAD
import {MockComponent} from 'ng-mocks';
=======
>>>>>>> origin
import {PanelMenu} from 'primeng/panelmenu';

describe('Integration Tests: DashboardLinksnavigationComponent', () => {
  let spectator: Spectator<DashboardLinksnavigationComponent>;
<<<<<<< HEAD
  const createdComponent = createComponentFactory({
    component: DashboardLinksnavigationComponent,
    declarations: [MockComponent(PanelMenu)],
    imports: [TranslateModule.forRoot()],
    providers: [TranslateService]
  });

  beforeEach(() => (spectator = createdComponent()));
=======
  const createComponent = createComponentFactory({
    component: DashboardLinksnavigationComponent,
    imports: [TranslateModule.forRoot()],
    declarations: [PanelMenu],
    providers: [TranslateService]
  });

  beforeEach(() => (spectator = createComponent()));
>>>>>>> origin

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
    expect(spectator.component).toBeTruthy();
  });
});
