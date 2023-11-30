import {DashboardWidgetComponent} from './dashboard-widget.component';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {PanelMenu} from 'primeng/panelmenu';

describe('Integration Tests: DashboardWidgetsComponent', () => {
  let spectator: Spectator<DashboardWidgetComponent>;
  const createdComponent = createComponentFactory({
    component: DashboardWidgetComponent,
    imports: [TranslateModule.forRoot()],
    declarations: [PanelMenu],
    providers: [TranslateService]
  });

  beforeEach(() => (spectator = createdComponent()));

  afterEach(() => {
    spectator.fixture.destroy();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should get background color class name', () => {
    const color = 'blue';
    const expected = `${color}-background`;
    const actual = spectator.component.getBackgroundColorClass('blue');
    expect(actual).toEqual(expected);
  });
});
