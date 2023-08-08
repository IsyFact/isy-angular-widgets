import {Injectable} from '@angular/core';
import {WidgetsTranslation} from './widgets-translation';
import {Subject} from 'rxjs';

/**
 * A service to translate labels in widgets library.
 */
@Injectable({
  providedIn: 'root'
})
export class WidgetsConfigService {

  private translation: WidgetsTranslation = {
    wizard: {
      back: 'Zurück',
      next: 'weiter',
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
      logout: 'Abmelden'
    }
  };

  private translationSource = new Subject<any>();

  getTranslation(path: string): any {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return path.split('.').reduce((o, k) => o ? (o as any)[k] : undefined, this.translation);
  }

  setTranslation(value: WidgetsTranslation): void {
    this.translation = { ...this.translation, ...value };
    this.translationSource.next(this.translation);
  }
}
