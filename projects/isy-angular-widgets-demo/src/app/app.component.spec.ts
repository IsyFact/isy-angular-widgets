import {DOCUMENT} from '@angular/core';
import {NavigationEnd, provideRouter, Router} from '@angular/router';
import {AppComponent} from './app.component';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {Subject} from 'rxjs';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

describe('Integration Tests: AppComponent', () => {
  let spectator: Spectator<AppComponent>;
  let mockDocument: Document;
  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [TranslateModule.forRoot()],
    providers: [
      {
        provide: DOCUMENT,
        useValue: document
      },
      TranslateService,
      provideRouter([])
    ]
  });

  beforeEach(() => {
    spectator = createComponent();
    mockDocument = spectator.inject(DOCUMENT);
  });

  it('the print button should have an aria-label attribute', () => {
    const element = spectator.query('p-button[icon="pi pi-print"] button') as HTMLElement;
    expect(element.hasAttribute('aria-label')).toBeTrue();
  });

  it('the info button should have an aria-label attribute', () => {
    const element = spectator.query('p-button[icon="pi pi-info-circle"] button') as HTMLElement;
    expect(element.hasAttribute('aria-label')).toBeTrue();
  });

  it('should create the application', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should display the user name', () => {
    expect(spectator.component.userInfo?.displayName).toEqual('Nutzer');
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
    const event = new KeyboardEvent('keyup', {key: 'Tab'});
    spyOn(event, 'preventDefault');
    spectator.component.handleKeyUp(event);
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
