import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import {
  DashboardLinksnavigationComponent
} from './components/dashboard-linksnavigation/dashboard-linksnavigation.component';
import {
  DashboardInformationsbereichComponent
} from './components/dashboard-informationsbereich/dashboard-informationsbereich.component';
import {DashboardWidgetComponent} from './components/dashboard-widget/dashboard-widget.component';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {CardModule} from 'primeng/card';
import {PanelMenuModule} from 'primeng/panelmenu';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [
        DashboardComponent,
        DashboardLinksnavigationComponent,
        DashboardInformationsbereichComponent,
        DashboardWidgetComponent
      ],
      imports: [
        TranslateModule.forRoot(),
        CardModule,
        PanelMenuModule
      ],
      providers: [
        TranslateService
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
