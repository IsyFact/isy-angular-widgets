import {createServiceFactory, SpectatorService} from '@ngneat/spectator';
import {WidgetsConfigService} from './widgets-config.service';
import {WidgetsTranslation} from './widgets-translation';

describe('Unit tests: WidgetsConfigService', () => {
  let spectator: SpectatorService<WidgetsConfigService>;
  const createdService = createServiceFactory(WidgetsConfigService);

  beforeEach(() => (spectator = createdService()));

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
  });

  it('should get the translated text', () => {
    const text = 'hauptfenster.logout';
    let translatedText = spectator.service.getTranslation(text);
    expect(translatedText).toEqual('Abmelden');

    const data: WidgetsTranslation = {
      hauptfenster: {
        logout: 'Logout'
      }
    };

    spectator.service.setTranslation(data);
    translatedText = spectator.service.getTranslation(text);
    expect(translatedText).toEqual('Logout');
  });

  it('should merge nested translations without removing existing values', () => {
    spectator.service.setTranslation({
      wizard: {
        back: 'Back'
      }
    });

    expect(spectator.service.getTranslation('wizard.back')).toEqual('Back');
    expect(spectator.service.getTranslation('wizard.next')).toEqual('Weiter');
    expect(spectator.service.getTranslation('wizard.save')).toEqual('Speichern');
    expect(spectator.service.getTranslation('wizard.close')).toEqual('Schließen');
  });

  it('should emit updated translation values via getTranslation$', (done) => {
    const emittedValues: string[] = [];

    spectator.service.getTranslation$('hauptfenster.logout').subscribe((value) => {
      emittedValues.push(value);

      if (emittedValues.length === 2) {
        expect(emittedValues).toEqual(['Abmelden', 'Logout']);
        done();
      }
    });

    spectator.service.setTranslation({
      hauptfenster: {
        logout: 'Logout'
      }
    });
  });

  it('should return updated translations after setTranslation', () => {
    spectator.service.setTranslation({
      hauptfenster: {
        logout: 'Logout'
      },
      wizard: {
        back: 'Back'
      }
    });

    expect(spectator.service.getTranslations()).toEqual({
      wizard: {
        back: 'Back',
        next: 'Weiter',
        save: 'Speichern',
        close: 'Schließen'
      },
      inputChar: {
        headerBaseChars: 'Basis',
        headerGroups: 'Gruppen',
        insert: 'Einfügen'
      },
      hauptfenster: {
        altLogoAwl: 'Logo der Anwendungslandschaft',
        altLogoAnbieterAwl: 'Logo des Anbieters der Anwendungslandschaft',
        logout: 'Logout',
        browserWarning: {
          currentBrowserFallback: 'Ihr aktuell verwendeter Browser',
          message:
            '{{browser}} wird von dieser Anwendung nicht unterstützt. Bitte verwenden Sie eine unterstützte Browser-Version: {{supportedBrowsers}}.',
          supportedBrowser: '{{browser}} ab Version {{version}}'
        }
      },
      formWrapper: {
        required: 'Pflichtfeld'
      }
    });
  });

  it('should interpolate translation params', () => {
    const translatedText = spectator.service.getTranslation('hauptfenster.browserWarning.supportedBrowser', {
      browser: 'Google Chrome',
      version: '112'
    });

    expect(translatedText).toEqual('Google Chrome ab Version 112');
  });

  it('should interpolate multiple occurrences of the same translation param', () => {
    spectator.service.setTranslation({
      hauptfenster: {
        browserWarning: {
          message: '{{browser}} / {{browser}} / {{supportedBrowsers}}'
        }
      }
    });

    const translatedText = spectator.service.getTranslation('hauptfenster.browserWarning.message', {
      browser: 'Google Chrome',
      supportedBrowsers: 'Microsoft Edge'
    });

    expect(translatedText).toEqual('Google Chrome / Google Chrome / Microsoft Edge');
  });

  it('should merge nested browser warning translations without removing existing values', () => {
    spectator.service.setTranslation({
      hauptfenster: {
        browserWarning: {
          message: '{{browser}} is not supported. Supported browsers: {{supportedBrowsers}}.'
        }
      }
    });

    expect(
      spectator.service.getTranslation('hauptfenster.browserWarning.message', {
        browser: 'Google Chrome 1.0.0',
        supportedBrowsers: 'Google Chrome version 112 or later'
      })
    ).toEqual('Google Chrome 1.0.0 is not supported. Supported browsers: Google Chrome version 112 or later.');

    expect(spectator.service.getTranslation('hauptfenster.browserWarning.currentBrowserFallback')).toEqual(
      'Ihr aktuell verwendeter Browser'
    );

    expect(
      spectator.service.getTranslation('hauptfenster.browserWarning.supportedBrowser', {
        browser: 'Google Chrome',
        version: '112'
      })
    ).toEqual('Google Chrome ab Version 112');
  });

  it('should return an empty string for unknown translation paths', () => {
    expect(spectator.service.getTranslation('hauptfenster.unknown')).toEqual('');
  });
});
