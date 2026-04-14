import {WidgetsConfigService} from './widgets-config.service';
import {WidgetsTranslation} from './widgets-translation';
import {createServiceFactory, SpectatorService} from '@ngneat/spectator';

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
});
