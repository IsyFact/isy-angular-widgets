import {DashboardWidgetComponent} from './dashboard-widget.component';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
<<<<<<< HEAD
import {MockComponent} from 'ng-mocks';
=======
>>>>>>> origin
import {PanelMenu} from 'primeng/panelmenu';

describe('Integration Tests: DashboardWidgetsComponent', () => {
  let spectator: Spectator<DashboardWidgetComponent>;
<<<<<<< HEAD
  const createdComponent = createComponentFactory({
    component: DashboardWidgetComponent,
    declarations: [MockComponent(PanelMenu)],
    imports: [TranslateModule.forRoot()],
    providers: [TranslateService]
  });

  beforeEach(() => (spectator = createdComponent()));

  afterEach(() => {
    spectator.fixture.destroy();
=======
  const createComponent = createComponentFactory({
    component: DashboardWidgetComponent,
    imports: [TranslateModule.forRoot()],
    declarations: [PanelMenu],
    providers: [TranslateService]
>>>>>>> origin
  });

  beforeEach(() => (spectator = createComponent()));

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
<<<<<<< HEAD
  });

  it('should get background color class name', () => {
    const color = 'blue';
    const expected = `${color}-background`;
    const actual = spectator.component.getBackgroundColorClass('blue');
    expect(actual).toEqual(expected);
=======
>>>>>>> origin
  });
});
