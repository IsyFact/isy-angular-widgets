import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DashboardWidgetComponent} from './dashboard-widget.component';
import {CardModule} from 'primeng/card';
import {TranslateModule} from '@ngx-translate/core';
import {PanelMenuModule} from 'primeng/panelmenu';
import {FormsModule} from '@angular/forms';

describe('Integration Tests: DashboardWidgetsComponent', () => {
  let component: DashboardWidgetComponent;
  let fixture: ComponentFixture<DashboardWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardWidgetComponent],
      imports: [TranslateModule.forRoot(), PanelMenuModule, CardModule, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get background color class name', () => {
    const color = 'blue';
    const expected = `${color}-background`;
    const actual = component.getBackgroundColorClass('blue');
    expect(actual).toEqual(expected);
  });
});
