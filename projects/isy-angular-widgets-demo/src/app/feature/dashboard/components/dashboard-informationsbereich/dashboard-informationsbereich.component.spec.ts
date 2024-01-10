import {DashboardInformationsbereichComponent} from './dashboard-informationsbereich.component';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {PanelMenu} from 'primeng/panelmenu';
import {createComponentFactory, Spectator} from '@ngneat/spectator';

describe('Integration Tests: DashboardInformationsbereichComponent', () => {
  let spectator: Spectator<DashboardInformationsbereichComponent>;
  const createComponent = createComponentFactory({
    component: DashboardInformationsbereichComponent,
    imports: [TranslateModule.forRoot()],
    declarations: [PanelMenu],
    providers: [TranslateService]
  });

  beforeEach(() => (spectator = createComponent()));

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
