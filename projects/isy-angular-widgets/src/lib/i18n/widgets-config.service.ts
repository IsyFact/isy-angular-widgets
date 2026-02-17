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

  private readonly translationSource = new Subject<unknown>();

  getTranslation(path: string): string {
    // Needs to be refactored in the future
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
    const value = path.split('.').reduce((o, k) => (o ? (o as any)[k] : undefined), this.translation) as unknown;

    return typeof value === 'string' ? value : '';
  }

  setTranslation(value: WidgetsTranslation): void {
    this.translation = {...this.translation, ...value};
    this.translationSource.next(this.translation);
  }
}
