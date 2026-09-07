<h1 align="center">
  <a href="https://www.bva.bund.de/DE/Das-BVA/Aufgaben/I/Informationstechnik/IsyFact/isyfact_node.html">
    <img src="../../.github/assets/logo-isyfact.jpg" alt="IsyFact" width="340">
  </a>
</h1>

<p align="center">
  <strong>isy-angular-widgets</strong> – Widget-Bibliothek für Angular-Anwendungen der öffentlichen Verwaltung
</p>

<p align="center">
  <a href="https://github.com/IsyFact/isy-angular-widgets/actions/workflows/node.js.yml">
    <img src="https://github.com/IsyFact/isy-angular-widgets/actions/workflows/node.js.yml/badge.svg" alt="Node.js CI">
  </a>
  <a href="https://www.npmjs.com/package/@isyfact/isy-angular-widgets">
    <img src="https://img.shields.io/npm/v/@isyfact/isy-angular-widgets" alt="npm-Version">
  </a>
</p>

<p align="center">
  <a href="https://isyfact.github.io/isy-angular-widgets/v21/">Demo-Anwendung</a> ·
  <a href="https://isyfact.github.io/isy-angular-widgets/v21/documentation/">API-Dokumentation</a> ·
  <a href="./MIGRATION.md">Migration</a> ·
  <a href="https://github.com/IsyFact/isy-angular-widgets/blob/support/21/CHANGELOG.md">Changelog</a>
</p>

---

`isy-angular-widgets` stellt behördenspezifische Komponenten auf Basis von [PrimeNG](https://primeng.org/) bereit und unterstützt damit die Umsetzung von Frontends gemäß dem [IsyFact-Bedienkonzept](https://isyfact.github.io/isy-bedienkonzept-doc/current/bedienkonzept.html). Enthalten ist zudem ein IsyFact-Theme, das sich an den Richtlinien für Design und Barrierefreiheit des Bundes orientiert.

> **Versionslinie 21.** Diese Dokumentation beschreibt die Ausgabe der Bibliothek für **Angular 21** und **PrimeNG 21**. Die neueste Versionslinie wird auf dem Branch `develop` gepflegt.

Diese Dokumentation richtet sich an Entwicklerinnen und Entwickler, die **die Bibliothek in einer eigenen Anwendung einsetzen**.

> Du möchtest die Bibliothek selbst weiterentwickeln? Dann ist die [README im Repository-Root](https://github.com/IsyFact/isy-angular-widgets/blob/support/21/README.md) der richtige Einstieg.

Praktische und querschnittliche Beispiele für die Umsetzung von Styleguide-Patterns zeigt die [Demo-Anwendung](https://isyfact.github.io/isy-angular-widgets/v21/).

## Inhalt

- [Features](#features)
- [Bereitgestellte Bausteine](#bereitgestellte-bausteine)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Weiterführende Dokumentation](#weiterführende-dokumentation)
- [Migration auf eine neue Version](#migration-auf-eine-neue-version)

## Features

| Feature | Nutzen |
|---|---|
| **Hauptfenster** | Einheitlicher Anwendungsrahmen für portalbasierte Behörden-IT-Landschaften – Kopfbereich, Navigation, Seitenleisten und Benutzerinformationen. Fachanwendungen betten ihre Inhalte ein und fügen sich ohne Zusatzaufwand ins Portal ein. |
| **IsyFact-Theme** | Orientiert sich an den Richtlinien zur Barrierefreiheit und am Styleguide des Bundes. Über PrimeNG-Presets anpassbar, sodass sich einzelne Portalanwendungen abheben können, ohne den gemeinsamen Rahmen zu verlassen. |
| **Berechtigungen** | Zwei Ebenen aus einer Rechtekonfiguration: Der `AuthGuard` schützt Routen und damit ganze Navigationsbereiche, die Strukturdirektive `*isyPermitted` bindet einzelne Bedienelemente wie Buttons an ein Recht. |
| **Ungewisses Datum** | Erfasst unvollständige Datumsangaben wie `00.00.1985` oder `xx.03.1985` in deutscher Eingabemaske – originalgetreu statt mit erfundenen Platzhaltern. |
| **Sonderzeichen-Picker** | Findet diakritische Zeichen über das Grundzeichen: Die Suche nach `E` liefert alle 44 Varianten (`È`, `É`, `Ê`, `Ë`, `Ē`, `Ě` …). Vollständig per Tastatur bedienbar, inklusive griechischer und kyrillischer Zeichen. |
| **Validatoren** | Prüfungen, die Angular nicht mitbringt: **DIN 91379** für Namens- und Adressfelder (Datentypen A–E), ungewisse Datumsangaben sowie ISO-Datum und -Zeit – ohne Abhängigkeit zu `moment.js`. |
| **Form-Wrapper** | Vereinheitlicht Label, Pflichtfeldkennzeichnung und Fehlertext. Verdrahtet `aria-describedby`, `aria-invalid` und `aria-errormessage` automatisch mit dem Eingabefeld. |
| **Skip-Links** | Sprungmarken zu den Hauptinhalten für Tastatur- und Screenreader-Nutzende, inklusive zuverlässiger Fokussteuerung auf das Sprungziel. |

## Bereitgestellte Bausteine

Die folgende Übersicht listet die öffentlich bereitgestellten Komponenten, Direktiven, Services und Pipes. Der Name verlinkt jeweils auf die zugehörige API-Referenz.

| Baustein | Art | Beschreibung |
|---|---|---|
| [`HauptfensterComponent`](https://isyfact.github.io/isy-angular-widgets/v21/documentation/components/HauptfensterComponent.html) | Komponente | Anwendungsrahmen mit Kopfbereich, Hauptnavigation, Titelzeile, Linksnavigation und Informationsbereich. Optional mit responsivem Verhalten. |
| [`SeitentoolbarComponent`](https://isyfact.github.io/isy-angular-widgets/v21/documentation/components/SeitentoolbarComponent.html) | Komponente | Toolbar unterhalb der Titelzeile, etwa für Navigations- und Zurück-Buttons. |
| [`SkipLinksComponent`](https://isyfact.github.io/isy-angular-widgets/v21/documentation/components/SkipLinksComponent.html) | Komponente | Sprungmarken, mit denen Tastatur- und Screenreader-Nutzende wiederkehrende Bereiche überspringen. |
| [`FormWrapperComponent`](https://isyfact.github.io/isy-angular-widgets/v21/documentation/components/FormWrapperComponent.html) | Komponente | Kapselt ein Formularfeld mit Label, Pflichtfeldkennzeichnung, Fehlermeldung und der ARIA-Verdrahtung dazwischen. |
| [`IncompleteDateComponent`](https://isyfact.github.io/isy-angular-widgets/v21/documentation/components/IncompleteDateComponent.html) | Komponente | Eingabefeld für vollständige und unvollständige Datumsangaben im Format `DD.MM.YYYY`; unbekannte Teile werden als `0` oder `x` erfasst. |
| [`InputCharComponent`](https://isyfact.github.io/isy-angular-widgets/v21/documentation/components/InputCharComponent.html) | Komponente | Auswahldialog für Sonderzeichen, gegliedert nach Grundzeichen und Schriftzeichengruppen der DIN 91379. |
| [`WizardComponent`](https://isyfact.github.io/isy-angular-widgets/v21/documentation/components/WizardComponent.html) | Komponente | Dialog zur schrittweisen Führung durch mehrstufige Eingaben. |
| [`SecurityDirective`](https://isyfact.github.io/isy-angular-widgets/v21/documentation/directives/SecurityDirective.html) | Direktive | Blendet einzelne Bedienelemente wie Buttons abhängig von einem Recht ein oder aus. |
| [`FormWrapperFieldDirective`](https://isyfact.github.io/isy-angular-widgets/v21/documentation/directives/FormWrapperFieldDirective.html) | Direktive | Kennzeichnet ein natives `input`, `textarea` oder `select` innerhalb eines Form-Wrappers für die automatische ARIA-Verdrahtung. |
| [`InputCharDirective`](https://isyfact.github.io/isy-angular-widgets/v21/documentation/directives/InputCharDirective.html) | Direktive | Bindet den Sonderzeichen-Dialog an ein bestehendes Eingabefeld an. |
| [`WizardDirective`](https://isyfact.github.io/isy-angular-widgets/v21/documentation/directives/WizardDirective.html) | Direktive | Definiert einen einzelnen Schritt innerhalb eines Wizards. |
| [`WizardFooterDirective`](https://isyfact.github.io/isy-angular-widgets/v21/documentation/directives/WizardFooterDirective.html) | Direktive | Ersetzt den Fußbereich des Wizards durch eigene Bedienelemente. |
| [`SecurityService`](https://isyfact.github.io/isy-angular-widgets/v21/documentation/injectables/SecurityService.html) | Service | Hält die Rechtekonfiguration und beantwortet Berechtigungsprüfungen für Routen und Elemente. |
| [`AuthGuard`](https://isyfact.github.io/isy-angular-widgets/v21/documentation/injectables/AuthGuard.html) | Route-Guard | Verhindert beim Routing den Aufruf von Bereichen, für die das erforderliche Recht fehlt. |
| [`WidgetsConfigService`](https://isyfact.github.io/isy-angular-widgets/v21/documentation/injectables/WidgetsConfigService.html) | Service | Stellt die Übersetzungen der Widget-Beschriftungen bereit und ermöglicht einen Sprachwechsel zur Laufzeit. |
| [`IncompleteDateService`](https://isyfact.github.io/isy-angular-widgets/v21/documentation/injectables/IncompleteDateService.html) | Service | Wandelt unvollständige Datumsangaben in das deutsche Datumsformat um. |
| [`UserInfoService`](https://isyfact.github.io/isy-angular-widgets/v21/documentation/injectables/UserInfoService.html) | Abstrakter Service | Schnittstelle, über die die Anwendung die Daten der angemeldeten Person bereitstellt. Die Implementierung – etwa der Serveraufruf – erfolgt im Zielprojekt. |
| [`Validation`](https://isyfact.github.io/isy-angular-widgets/v21/documentation/classes/Validation.html) | Validator-Sammlung | Statische Validatoren für DIN 91379, unvollständige Datumsangaben, ISO-Datum und -Zeit sowie Kreditkartenangaben. |
| [`provideIsyFactTheme`](https://isyfact.github.io/isy-angular-widgets/v21/documentation/miscellaneous/functions.html#provideIsyFactTheme) | Provider-Funktion | Registriert das IsyFact-Theme inklusive CSS-Layer-Reihenfolge in der Anwendungskonfiguration. |
| [`FormControlPipe`](https://isyfact.github.io/isy-angular-widgets/v21/documentation/pipes/FormControlPipe.html) | Pipe | Typsichere Übergabe eines `AbstractControl` als `FormControl` im Template. |
| [`IncompleteDatePipe`](https://isyfact.github.io/isy-angular-widgets/v21/documentation/pipes/IncompleteDatePipe.html) | Pipe | Formatiert unvollständige Datumsangaben für die Anzeige. |
| [`CorrelationIdHttpInterceptor`](https://isyfact.github.io/isy-angular-widgets/v21/documentation/interceptors/CorrelationIdHttpInterceptor.html) | HTTP-Interceptor | Ergänzt ausgehende Requests um eine Korrelations-ID gemäß IsyFact-Vorgaben. |
| [`ZipkinOpenTracingHttpInterceptor`](https://isyfact.github.io/isy-angular-widgets/v21/documentation/injectables/ZipkinOpenTracingHttpInterceptor.html) | HTTP-Interceptor | Ergänzt Requests um Tracing-Header nach dem OpenTracing-Standard in der Zipkin-Ausprägung. |

## Installation

Die Bibliothek setzt **Angular 21** und **PrimeNG 21** voraus und wird über ihre Schematic zu einem bestehenden Angular-Projekt hinzugefügt:

```bash
ng add @isyfact/isy-angular-widgets
```

Ist die Bibliothek bereits installiert – etwa aus einem lokal gebauten TGZ-Paket – wird die Schematic direkt ausgeführt:

```bash
npx ng generate @isyfact/isy-angular-widgets:ng-add
```

> **Hinweis:** `ng add` sollte nicht direkt auf eine lokale TGZ-Datei angewendet werden, da die Angular CLI die Paketinformationen lokaler Dateien unter Umständen nicht korrekt ausliest.

### Was die Schematic einrichtet

- Eintragen der Bibliothek und der benötigten Abhängigkeiten in die `package.json`
- Einbinden der IsyFact-Styles sowie der PrimeFlex-Utilities
- Ergänzen des projektspezifischen Assets-Pfads in der `angular.json`
- Hinzufügen der Übersetzungsdateien für die Bibliothek und PrimeNG in Deutsch und Englisch
- *(Optional)* Konfiguration der IsyFact-ESLint-Regeln über [`@isyfact/eslint-plugin`](https://github.com/IsyFact/isy-eslint-plugin)
- *(Optional)* Konfiguration der IsyFact-Prettier-Regeln über [`@isyfact/prettier-plugin`](https://github.com/IsyFact/isy-prettier-plugin)

Die beiden optionalen Schritte werden während der Installation per CLI-Prompt abgefragt. Beide sind standardmäßig aktiviert und lassen sich über die Schema-Optionen `addEslint` und `addPrettier` vorbelegen. Auf der Kommandozeile werden diese – wie bei der Angular CLI üblich – in Kebab-Case angegeben:

```bash
npx ng generate @isyfact/isy-angular-widgets:ng-add --add-eslint=false --add-prettier=false
```

In einem Monorepo richtet die Schematic Styles, Assets und Übersetzungen für alle Anwendungsprojekte ein. Über das Flag `project` lässt sich die Einrichtung auf ein einzelnes Anwendungsprojekt begrenzen:

```bash
npx ng generate @isyfact/isy-angular-widgets:ng-add --project=meine-anwendung
```

ESLint und Prettier werden unabhängig davon immer für den gesamten Workspace konfiguriert.

#### ESLint

Optional wird eine `eslint.config.js` im Projektstamm angelegt, die die IsyFact-ESLint-Regeln aus [`isy-eslint-plugin`](https://github.com/IsyFact/isy-eslint-plugin) einbindet. Unterstützt werden einfache Angular-Projekte und Monorepos; für jedes Projekt entstehen passende Konfigurationsblöcke für TypeScript-, Spec- und HTML-Dateien. Zusätzlich wird ein `lint`-Script in der `package.json` ergänzt.

Eine bereits vorhandene `eslint.config.js` wird als `eslint.config.base.js` gesichert und in die neue Konfiguration eingebunden.

```bash
npm run lint
```

#### Prettier

Optional wird eine `.prettierrc.js` angelegt, die die IsyFact-Prettier-Regeln aus [`isy-prettier-plugin`](https://github.com/IsyFact/isy-prettier-plugin) einbindet. Ergänzt werden zudem eine `.prettierignore` mit den IsyFact-Standardausschlüssen und ein `format`-Script in der `package.json`.

Eine bereits vorhandene `.prettierrc.js` wird nicht überschrieben.

> **Hinweis:** Enthält das Projekt bereits eine andere Prettier-Konfiguration – etwa eine `.prettierrc` –, hat diese bei der Konfigurationssuche von Prettier Vorrang vor der `.prettierrc.js`, sodass die IsyFact-Regeln nicht greifen. Welche Konfiguration tatsächlich verwendet wird, lässt sich so prüfen:
>
> ```bash
> npx prettier --find-config-path src/app/app.ts
> ```

```bash
npm run format
```

## Getting Started

Nach der Installation kann das Hauptfenster-Widget eingebunden werden. In einem neu generierten Projekt lässt sich der Inhalt der Datei `app.html` beispielhaft ersetzen:

```html
<isy-hauptfenster
  responsive
  [collapsedLinksnavigation]="false"
  [collapsedInformationsbereich]="true"
  [showInformationsbereich]="true"
  [showLinksnavigation]="true"
  [userInfo]="{
    displayName: 'Max Mustermann'
  }"
  [items]="[
    {label: 'Menüeintrag 1'},
    {label: 'Menüeintrag 2'},
    {label: 'Menüeintrag 3'}
  ]"
  applicationGroupColor="#458648"
  linksNavigationWidth="200px"
  logoAwl="{image-src}"
  logoAnbieterAwl="{image-src}"
>
  <p-menu Linksnavigation
    [model]="[
      {label: 'Menüeintrag 1', icon: 'pi pi-check'},
      {label: 'Menüeintrag 2', icon: 'pi pi-check'},
      {label: 'Menüeintrag 3', icon: 'pi pi-check'}
    ]"
  ></p-menu>
  <p-panel header="Inhaltsbereich">
    Darstellung von Formularen, Tabellen, etc.
  </p-panel>
  <p Informationsbereich class="p-2">
    Inhalt des Informationsbereich.
  </p>
</isy-hauptfenster>
```

Anschließend werden die `HauptfensterComponent` sowie die verwendeten PrimeNG-Module in der Datei `app.ts` importiert:

```typescript
// Other imports ...
import {Component} from '@angular/core';
import {HauptfensterComponent} from '@isyfact/isy-angular-widgets';
import {MenuModule} from 'primeng/menu';
import {PanelModule} from 'primeng/panel';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  imports: [HauptfensterComponent, PanelModule, MenuModule]
})
export class App {}
```

Abschließend wird in der `app.config.ts` die Methode `provideIsyFactTheme` bereitgestellt:

```typescript
// Other imports ...
import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {provideIsyFactTheme} from '@isyfact/isy-angular-widgets';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideIsyFactTheme()]
};
```

Damit ist die Bibliothek einsatzbereit. Die folgenden Abschnitte sind optional.

### Theming

Die Bibliothek liefert mit `provideIsyFactTheme()` ein vorkonfiguriertes PrimeNG-Theme aus. Als Standard dient das PrimeNG-Preset **Nora**. Der Provider setzt zugleich die CSS-Layer-Reihenfolge (`primeng, isyfact-theme`) und deaktiviert den Dark Mode.

Optional lässt sich ein abweichendes Preset als Argument übergeben:

```typescript
import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideIsyFactTheme} from '@isyfact/isy-angular-widgets';
import Material from '@primeuix/themes/material';
import {routes} from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideIsyFactTheme(Material),
    provideRouter(routes)
  ]
};
```

Eigene Presets können mit `definePreset()` aus `@primeuix/themes` erstellt und ebenso übergeben werden.

> **Hinweis:** Seit PrimeNG 21 werden Animationen CSS-basiert umgesetzt. Eine zusätzliche Aktivierung über `provideAnimations`, `provideAnimationsAsync` oder `BrowserAnimationsModule` ist nicht mehr erforderlich; die entsprechenden Angular-Provider sind deprecated. Verwendet eine Anwendung weiterhin eigene Animationen aus `@angular/animations`, ist eine Migration auf native CSS-Animationen zu prüfen.

### Internationalisierung

`isy-angular-widgets` unterstützt beliebige Sprachen; standardmäßig werden die Widgets auf Deutsch dargestellt. Bei der Installation über die Schematic werden deutsche und englische Übersetzungsdateien für PrimeNG und die Bibliothek unter `src/assets/i18n` angelegt.

Das folgende Beispiel zeigt die Anbindung mit [`@ngx-translate`](https://ngx-translate.org/); prinzipiell kann jede I18N-Bibliothek eingesetzt werden.

```bash
npm install @ngx-translate/core @ngx-translate/http-loader --save
```

Zunächst werden die Provider bereitgestellt, zum Beispiel in `app.config.ts`:

```typescript
// Other imports ...
import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideHttpClient} from '@angular/common/http';
import {provideTranslateHttpLoader, TranslateHttpLoader} from '@ngx-translate/http-loader';
import {provideTranslateLoader, provideTranslateService} from '@ngx-translate/core';
import {provideIsyFactTheme} from '@isyfact/isy-angular-widgets';
import {routes} from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideIsyFactTheme(),
    provideHttpClient(),
    provideTranslateService(),
    provideTranslateLoader(TranslateHttpLoader),
    provideTranslateHttpLoader({
      prefix: './assets/i18n/',
      suffix: '.json'
    })
  ]
};
```

Anschließend werden die Übersetzungen für PrimeNG und die Bibliothek bereitgestellt, zum Beispiel in `app.ts`:

```typescript
import {ChangeDetectorRef, Component, OnDestroy, inject} from '@angular/core';
import {HauptfensterComponent, WidgetsConfigService} from '@isyfact/isy-angular-widgets';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {PrimeNG} from 'primeng/config';
import {MenuModule} from 'primeng/menu';
import {PanelModule} from 'primeng/panel';
import {Subscription} from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  imports: [HauptfensterComponent, PanelModule, MenuModule, TranslateModule]
})
export class App implements OnDestroy {
  private readonly primeng = inject(PrimeNG);
  private readonly widgetsConfigService = inject(WidgetsConfigService);
  private readonly translate = inject(TranslateService);
  private readonly cdr = inject(ChangeDetectorRef);

  private primeNgSub?: Subscription;
  private widgetSub?: Subscription;
  private langSub?: Subscription;

  constructor() {
    this.translate.addLangs(['de', 'en']);
    this.translate.setFallbackLang('en');
    this.translate.use('de');

    this.primeNgSub = this.translate.stream('primeng').subscribe((res) => {
      this.primeng.setTranslation(res);
    });

    this.widgetSub = this.translate.stream('isyAngularWidgets').subscribe((res) => {
      this.widgetsConfigService.setTranslation(res);
    });

    this.langSub = this.translate.onLangChange.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.primeNgSub?.unsubscribe();
    this.widgetSub?.unsubscribe();
    this.langSub?.unsubscribe();
  }
}
```

Das `TranslateModule` stellt `TranslatePipe` und `TranslateDirective` bereit und wird benötigt, sobald Texte direkt im Template übersetzt werden.

Die `translate`-Methode kann beispielsweise auch für einen Language-Picker verwendet werden, damit Benutzer die Sprache selbst wählen können.

## Weiterführende Dokumentation

| Ressource | Inhalt |
|---|---|
| [API-Referenz (Compodoc)](https://isyfact.github.io/isy-angular-widgets/v21/documentation/) | Alle Komponenten, Direktiven und Services mit Inputs, Outputs und Beispielen |
| [IsyFact-Bedienkonzept](https://isyfact.github.io/isy-bedienkonzept-doc/current/bedienkonzept.html) | Fachliche und gestalterische Vorgaben, die den Widgets zugrunde liegen |
| [Demo-Anwendung](https://isyfact.github.io/isy-angular-widgets/v21/) | Lauffähige Beispiele der Widgets und Styleguide-Patterns |

## Migration auf eine neue Version

Breaking Changes und Migrationshinweise für jeden Versionssprung bis einschließlich Version 21 stehen in der [MIGRATION.md](./MIGRATION.md) – darunter auch die Umstellung der Datumsvalidierung von `moment.js` auf native `Date`-Logik.

Eine vollständige Liste aller Änderungen enthält das [CHANGELOG.md](https://github.com/IsyFact/isy-angular-widgets/blob/support/21/CHANGELOG.md).
