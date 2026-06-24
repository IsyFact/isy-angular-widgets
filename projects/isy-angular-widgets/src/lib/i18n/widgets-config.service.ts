import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {distinctUntilChanged, map} from 'rxjs/operators';
import {WidgetsTranslation} from './widgets-translation';

type TranslationParams = Record<string, string | number>;

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
      logout: 'Abmelden',
      browserWarning: {
        currentBrowserFallback: 'Ihr aktuell verwendeter Browser',
        message:
          '{{browser}} wird von dieser Anwendung nicht unterstützt. Bitte verwenden Sie eine unterstützte Browser-Version: {{supportedBrowsers}}.',
        supportedBrowser: '{{browser}} ab Version {{version}}'
      }
    },
    formWrapper: {
      required: 'Pflichtfeld'
    },
    seitentoolbar: {
      back: 'Zurück zur Übersicht'
    }
  };

  private readonly translationSource = new BehaviorSubject(this.translation);

  readonly translation$: Observable<WidgetsTranslation> = this.translationSource.asObservable();

  getTranslation(path: string, params: TranslationParams = {}): string {
    const value = path.split('.').reduce<unknown>((current, key) => {
      if (!current || typeof current !== 'object') {
        return undefined;
      }

      return (current as Record<string, unknown>)[key];
    }, this.translation);

    return typeof value === 'string' ? this.interpolate(value, params) : '';
  }

  getTranslation$(path: string, params: TranslationParams = {}): Observable<string> {
    return this.translation$.pipe(
      map(() => this.getTranslation(path, params)),
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
        ...value.hauptfenster,
        browserWarning: {
          ...this.translation.hauptfenster?.browserWarning,
          ...value.hauptfenster?.browserWarning
        }
      },
      formWrapper: {
        ...this.translation.formWrapper,
        ...value.formWrapper
      },
      seitentoolbar: {
        ...this.translation.seitentoolbar,
        ...value.seitentoolbar
      }
    };

    this.translationSource.next(this.translation);
  }

  getTranslations(): WidgetsTranslation {
    return this.translation;
  }

  private interpolate(value: string, params: TranslationParams): string {
    return Object.entries(params).reduce(
      (result, [key, replacement]) => result.replaceAll(`{{${key}}}`, String(replacement)),
      value
    );
  }
}
