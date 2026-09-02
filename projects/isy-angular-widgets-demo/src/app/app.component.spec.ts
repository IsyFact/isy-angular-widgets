import {DOCUMENT} from '@angular/core';
import {NavigationEnd, provideRouter, Router} from '@angular/router';
import {AppComponent} from './app.component';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {firstValueFrom, of, Subject} from 'rxjs';
import {InterpolatableTranslationObject, TranslateModule, TranslateService} from '@ngx-translate/core';
import {routes} from './app.routes';

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
      provideRouter(routes)
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

  it('should open the browser print dialog once when the print button is activated', () => {
    const print = spyOn(window, 'print');

    spectator.click('p-button[icon="pi pi-print"] button');

    expect(print).toHaveBeenCalledOnceWith();
  });

  it('should update the displayed print date immediately before browser printing', () => {
    const stalePrintDate = new Date('2000-01-01T00:00:00.000Z');
    const currentPrintDate = new Date('2026-09-02T12:34:56.000Z');
    spectator.component.printDate = stalePrintDate;
    spectator.detectChanges();

    jasmine.clock().install();
    jasmine.clock().mockDate(currentPrintDate);

    try {
      window.dispatchEvent(new Event('beforeprint'));

      const time = spectator.query('.demo-print-header time') as HTMLTimeElement;
      expect(time.dateTime).toBe(currentPrintDate.toISOString());
    } finally {
      jasmine.clock().uninstall();
    }
  });

  it('should display the translated error title for an unknown route on screen and in print', async () => {
    const router = spectator.inject(Router);
    const translate = spectator.inject(TranslateService);
    mockDocument.title = 'Objekt suchen';
    translate.setTranslation(
      'de',
      {
        isyAngularWidgetsDemo: {
          websiteTitles: {pageNotFound: 'Seite nicht gefunden'},
          messages: {changePage: 'Seite gewechselt:'}
        }
      },
      true
    );
    translate.setTranslation(
      'en',
      {
        isyAngularWidgetsDemo: {
          websiteTitles: {pageNotFound: 'Page not found'},
          messages: {changePage: 'Page changed:'}
        }
      },
      true
    );
    await firstValueFrom(translate.use('de'));

    expect(await router.navigateByUrl('/unbekannte-route')).toBeTrue();
    await spectator.fixture.whenStable();
    spectator.detectChanges();

    expect(router.url).toBe('/unbekannte-route');
    expect(spectator.query('demo-page-not-found')).toBeTruthy();
    expect(mockDocument.title).toBe('Seite nicht gefunden');
    expect((spectator.query('.demo-print-header h1') as HTMLElement).innerText).toBe('Seite nicht gefunden');

    await firstValueFrom(translate.use('en'));
    spectator.detectChanges();

    expect(mockDocument.title).toBe('Page not found');
    expect((spectator.query('.demo-print-header h1') as HTMLElement).innerText).toBe('Page not found');
  });

  it('should exclude the application toolbar from print', () => {
    expect(spectator.query('isy-seiten-toolbar[Seitentoolbar].isy-print-hide')).toBeTruthy();
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
    const translate = spectator.inject(TranslateService);
    const fakeTranslations: InterpolatableTranslationObject = {};
    spyOn(translate, 'use').and.returnValue(of(fakeTranslations));
    spectator.component.changeLanguage(language);
    spectator.fixture.detectChanges();
    expect(translate.use).toHaveBeenCalledWith(language);
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
