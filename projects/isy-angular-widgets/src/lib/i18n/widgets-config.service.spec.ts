import {WidgetsConfigService} from './widgets-config.service';
import {createServiceFactory, SpectatorService} from '@ngneat/spectator';

describe('Unit tests: WidgetsConfigService', () => {
  let spectator: SpectatorService<WidgetsConfigService>;
  const createdService = createServiceFactory(WidgetsConfigService);

  beforeEach(() => (spectator = createdService()));

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
  });

  it('should get the translated text', () => {
    const text: string = 'hauptfenster.logout';
    let translatedText = spectator.service.getTranslation(text);
    expect(translatedText).toEqual('Abmelden');

    const data: object = {
      hauptfenster: {
        logout: 'Logout'
      }
    };
    spectator.service.setTranslation(data);
    translatedText = spectator.service.getTranslation(text);
    expect(translatedText).toEqual('Logout');
  });
});
