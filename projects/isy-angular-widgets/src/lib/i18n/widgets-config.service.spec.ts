import {TestBed} from '@angular/core/testing';
import {WidgetsConfigService} from './widgets-config.service';

describe('Unit tests: WidgetsConfigService', () => {
  let service: WidgetsConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WidgetsConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get the translated text', () => {
    const text: string = 'hauptfenster.logout';
    let translatedText = service.getTranslation(text);
    expect(translatedText).toEqual('Abmelden');

    const data: object = {
      hauptfenster: {
        logout: 'Logout'
      }
    };
    service.setTranslation(data);
    translatedText = service.getTranslation(text);
    expect(translatedText).toEqual('Logout');
  });
});
