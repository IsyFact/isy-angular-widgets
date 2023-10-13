import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DashboardInformationsbereichComponent} from './dashboard-informationsbereich.component';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {MenuTranslationService} from '../../../../shared/services/menu-translation.service';
import {PanelMenuModule} from 'primeng/panelmenu';

describe('Integration Tests: DashboardInformationsbereichComponent', () => {
  let component: DashboardInformationsbereichComponent;
  let fixture: ComponentFixture<DashboardInformationsbereichComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [
        DashboardInformationsbereichComponent
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

    fixture = TestBed.createComponent(DashboardInformationsbereichComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
