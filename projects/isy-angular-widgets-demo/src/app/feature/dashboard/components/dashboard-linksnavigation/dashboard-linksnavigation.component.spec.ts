import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DashboardLinksnavigationComponent} from './dashboard-linksnavigation.component';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {MenuTranslationService} from '../../../../../../../isy-angular-widgets/src/lib/i18n/menu-translation.service';
import {PanelMenuModule} from 'primeng/panelmenu';

describe('DashboardLinksnavigationComponent', () => {
  let component: DashboardLinksnavigationComponent;
  let fixture: ComponentFixture<DashboardLinksnavigationComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [
        DashboardLinksnavigationComponent
      ],
      imports: [
        PanelMenuModule,
        TranslateModule.forRoot()
      ],
      providers: [
        TranslateService,
        MenuTranslationService
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DashboardLinksnavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
