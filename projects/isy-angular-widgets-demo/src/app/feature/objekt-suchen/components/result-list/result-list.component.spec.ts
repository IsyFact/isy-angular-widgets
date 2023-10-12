import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ResultListComponent} from './result-list.component';
import {TableModule} from 'primeng/table';
import {SecurityModule} from '../../../../../../../isy-angular-widgets/src/lib/security/security.module';
import {SecurityService} from '../../../../../../../isy-angular-widgets/src/lib/security/security-service';
import {PanelModule} from 'primeng/panel';
import {ButtonModule} from 'primeng/button';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {WizardModule} from '../../../../../../../isy-angular-widgets/src/lib/wizard/wizard.module';
import {ActivatedRoute} from '@angular/router';
import {CalendarModule} from 'primeng/calendar';
import {DropdownModule} from 'primeng/dropdown';
import { TranslateTestingModule } from 'ngx-translate-testing';

describe('Integration Tests: ResultListComponent', () => {
  let component: ResultListComponent;
  let fixture: ComponentFixture<ResultListComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [
        ResultListComponent
      ],
      imports: [
        TableModule,
        SecurityModule,
        PanelModule,
        ButtonModule,
        BrowserAnimationsModule,
        WizardModule,
        CalendarModule,
        DropdownModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateTestingModule.withTranslations({})
      ],
      providers: [
        SecurityService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {params: {id: '1'}}
          }
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not be selected by default', () => {
    expect(component.selectedObject).toBeUndefined();
  });
});
