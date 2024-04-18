import {NavigationEnd, Router} from '@angular/router';
import {AppComponent} from './app.component';
import {AppModule} from './app.module';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {Subject} from 'rxjs';
import {DOCUMENT} from '@angular/common';

describe('Integration Tests: AppComponent', () => {
  let spectator: Spectator<AppComponent>;
  let mockDocument: Document;
  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [AppModule],
    providers: [
      {
        provide: DOCUMENT,
        useValue: document
      }
    ]
  });

  beforeEach(() => {
    spectator = createComponent();
    mockDocument = spectator.inject(DOCUMENT);
  });

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

  it('should prevent tab key default action if focus has not been set', () => {
    const event = new KeyboardEvent('keydown', {key: 'Tab'});
    spyOn(event, 'preventDefault');
    spectator.component.handleKeyDown(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should focus on input when setFocusOnInput is called with valid id', () => {
    const inputId = 'testInput';
    const inputElement = document.createElement('input');
    inputElement.id = inputId;
    spyOn(mockDocument, 'getElementById').and.returnValue(inputElement);
    spyOn(inputElement, 'focus');
    spectator.component.setFocusOnInput(inputId);
    expect(mockDocument.getElementById).toHaveBeenCalledWith(inputId);
    expect(inputElement.focus).toHaveBeenCalled();
    expect(spectator.component.focusHasBeenSet).toBeTrue();
  });

  it('should not attempt to focus if element does not exist', () => {
    const invalidId = 'invalidInput';
    spyOn(mockDocument, 'getElementById').and.returnValue(null);
    spectator.component.setFocusOnInput(invalidId);
    expect(mockDocument.getElementById).toHaveBeenCalledWith(invalidId);
    expect(spectator.component.focusHasBeenSet).toBeUndefined();
  });

  it('should reset focusHasBeenSet when NavigationEnd event is emitted', () => {
    const router = spectator.inject(Router);
    expect(spectator.component.focusHasBeenSet).toBeUndefined();
    (router.events as Subject<unknown>).next(new NavigationEnd(1, '/dashboard', '/objekt-suchen'));
    spectator.detectChanges();
    expect(spectator.component.focusHasBeenSet).toBeFalse();
  });
});
