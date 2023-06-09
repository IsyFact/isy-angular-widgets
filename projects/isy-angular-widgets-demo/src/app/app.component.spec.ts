import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import {HauptfensterModule} from '../../../isy-angular-widgets/src/lib/hauptfenster/hauptfenster.module';
import {SecurityService} from '../../../isy-angular-widgets/src/lib/security/security-service';
import {UserInfoPublicService} from './core/user/userInfoPublicService';
import {PanelMenuModule} from 'primeng/panelmenu';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('AppComponent', () => {
  let app: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HauptfensterModule,
        PanelMenuModule,
        BrowserAnimationsModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        SecurityService,
        UserInfoPublicService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should display the user name', () => {
    expect(app.userInfo?.displayName).toEqual('Max Mustermann');
  });

  it('the hauptfenster component should not be null', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const hauptfenster = fixture.nativeElement.querySelector('isy-hauptfenster') as HTMLElement;
    expect(hauptfenster).not.toBeNull();
  });
});
