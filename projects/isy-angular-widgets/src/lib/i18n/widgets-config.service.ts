import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {distinctUntilChanged, map} from 'rxjs/operators';
import {WidgetsTranslation} from './widgets-translation';

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
      logout: 'Abmelden'
    },
    formWrapper: {
      required: 'Pflichtfeld'
    }
  };

  private readonly translationSource = new BehaviorSubject(this.translation);

  readonly translation$: Observable<WidgetsTranslation> = this.translationSource.asObservable();

  getTranslation(path: string): string {
    const value = path.split('.').reduce<unknown>((current, key) => {
      if (!current || typeof current !== 'object') {
        return undefined;
      }

      return (current as Record<string, unknown>)[key];
    }, this.translation);

    return typeof value === 'string' ? value : '';
  }

  getTranslation$(path: string): Observable<string> {
    return this.translation$.pipe(
      map(() => this.getTranslation(path)),
      distinctUntilChanged()
    );
  }

  setTranslation(value: WidgetsTranslation): void {
    this.translation = {
      ...this.translation,
      wizard: {
        ...this.translation.wizard,
        ...value.wizard
      },
      inputChar: {
        ...this.translation.inputChar,
        ...value.inputChar
      },
      hauptfenster: {
        ...this.translation.hauptfenster,
        ...value.hauptfenster
      },
      formWrapper: {
        ...this.translation.formWrapper,
        ...value.formWrapper
      }
    };

    this.translationSource.next(this.translation);
  }

  getTranslations(): WidgetsTranslation {
    return this.translation;
  }
}
