import {DashboardWidgetComponent} from './dashboard-widget.component';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {PanelMenu} from 'primeng/panelmenu';

describe('Integration Tests: DashboardWidgetsComponent', () => {
  let spectator: Spectator<DashboardWidgetComponent>;
  const createComponent = createComponentFactory({
    component: DashboardWidgetComponent,
    imports: [TranslateModule.forRoot(), PanelMenu],
    providers: [TranslateService]
  });

  beforeEach(() => (spectator = createComponent()));

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
