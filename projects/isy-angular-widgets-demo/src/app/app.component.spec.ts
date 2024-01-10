import {AppComponent} from './app.component';
import {AppModule} from './app.module';
import {createComponentFactory, Spectator} from '@ngneat/spectator';

describe('Integration Tests: AppComponent', () => {
  let spectator: Spectator<AppComponent>;
  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [AppModule]
  });

  beforeEach(() => (spectator = createComponent()));

  it('should create the application', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should display the user name', () => {
    expect(spectator.component.userInfo?.displayName).toEqual('Max Mustermann');
  });

  it('the hauptfenster component should not be null', () => {
    const hauptfenster = spectator.fixture.nativeElement.querySelector('isy-hauptfenster') as HTMLElement;
    expect(hauptfenster).not.toBeNull();
  });

  it('should select the correct permission', () => {
    const role = 'admin';
    spectator.component.selectPermission(role);
    expect(spectator.component.userInfo.roles).toEqual([role]);
  });

  it('should setting up language', () => {
    const language = 'en';
    expect(spectator.component.translate.currentLang).not.toEqual(language);
    spectator.component.changeLanguage('en');
    spectator.fixture.detectChanges();
    expect(spectator.component.translate.currentLang).toEqual(language);
  });

  it('should return the english language', () => {
    const language = spectator.component.getLanguageIcon('en');
    expect(language).toEqual('gb');
  });

  it('should return the correct language', () => {
    const language = spectator.component.getLanguageIcon('de');
    expect(language).toEqual('de');
  });
});
