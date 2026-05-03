# isy-angular-widgets

[![Node.js CI](https://github.com/IsyFact/isy-angular-widgets/actions/workflows/node.js.yml/badge.svg)](https://github.com/IsyFact/isy-angular-widgets/actions/workflows/node.js.yml)

`isy-angular-widgets` ist eine Widget-Bibliothek, welche behördenspezifische Komponenten auf Basis von [PrimeNG](https://www.primefaces.org/primeng/) bereitstellt.
Die Bibliothek stellt zudem ein IsyFact-Theme bereit, welches sich nach den Richtlinien für Design und Barrierefreiheit des Bundes orientiert.

Praktische sowie querschnittliche Beispiele für die Umsetzung von Patterns des Styleguide sind in der Beispielanwendung [`isy-angular-widget-demo`](https://github.com/IsyFact/isy-angular-widgets/tree/main/projects/isy-angular-widgets-demo) zu finden.

## Hinweise zur Datumsvalidierung (ohne `moment.js`)

Die Validatoren akzeptieren je nach Typ unter anderem:

- JavaScript `Date`-Objekte
- ISO-Strings, zum Beispiel `YYYY-MM-DD`, `YYYY-MM-DDTHH:mm:ssZ` beziehungsweise mit Offset bei `isInFuture` und `isInPast`
- Bibliotheksformate wie `DD.MM.YYYY` sowie `DD-MM-YYYY`, nur bei `isInFuture` und `isInPast`
- numerische Timestamps, zum Beispiel `Date.now()`, nur bei `isInFuture` und `isInPast`
- Moment-ähnliche Objekte mit `toDate()` als Backward-Compatibility für bestehende Consumer

Wichtig: `isoDateTime` bleibt strikt und akzeptiert weiterhin ausschließlich das Format `YYYY-MM-DDTHH:mm:ssZ` mit literalem `Z` am Ende. DateTimes mit Offset wie `+01:00` bleiben dafür ungültig.

## Features

- Hauptfenster-Widget mit Seitenleisten, UserInfo und Navigation
- Standard-IsyFact-Theme mit konfigurierbaren Farben für Hauptnavigationspunkte
- MegaMenu im Header
- Unterstützung für Rollen und Rechte
- Widget für die Anzeige eines ungewissen Datums mit Eingabemaske für das deutsche Datumsformat
- Security-Modul für die Beschränkung von Rechten auf Navigationspunkte
- Direktive zur Einschränkung der Sichtbarkeit von einzelnen Widgets
- Wizard-Widget
- Special-Char-Picker Widgets
- Spezifische Validator-Methoden für Eingabefelder
- Form-Wrapper
- Skip-Links-Komponente für barrierefreies Springen zu Hauptinhalten
- Behördenspezifische Widgets und Widgets aus PrimeNG in deutscher und englischer Sprache

## Styling / Utility-Klassen

`isy-angular-widgets` verwendet keine PrimeFlex-Utilities mehr.
Für Utility-Klassen wird Tailwind CSS v4 eingesetzt.

Für die Verwendung mit PrimeNG wird zusätzlich `tailwindcss-primeui` genutzt, damit PrimeNG-Design-Tokens auch als Tailwind-Utilities verwendet werden können.

Hinweis für bestehende Anwendungen: Falls PrimeFlex-Klassen direkt in Templates oder Styles verwendet werden, müssen diese auf Tailwind-Utilities migriert werden.
Weitere Details dazu sind im Abschnitt [Migration von PrimeFlex auf Tailwind CSS](#migration-von-primeflex-auf-tailwind-css) beschrieben.

Bestehende komponentenspezifische Styles in `.scss`-Dateien der Bibliothek bleiben davon unberührt und können weiterhin verwendet werden.

## Getting Started

Mit folgendem Befehl wird die Bibliothek `isy-angular-widgets` zu einem bestehenden Angular-Projekt hinzugefügt:

```bash
ng add @isyfact/isy-angular-widgets
```

Die Schematics führen folgende Schritte aus:

- Hinzufügen und Installation der Bibliothek sowie der benötigten Abhängigkeiten
- Einbinden der IsyFact-Styles
- Einbinden der Tailwind-CSS-Basis sowie der PrimeNG-Tailwind-Integration
- Hinzufügen der Übersetzungsdateien für die Bibliothek und PrimeNG in deutscher und englischer Sprache
- *(Optional)* Konfiguration der ESLint-Regeln der IsyFact (`@isyfact/eslint-plugin`) inkl. Unterstützung für einfache Projekte und Monorepos
- *(Optional)* Konfiguration der Prettier-Regeln der IsyFact (`@isyfact/prettier-plugin`)
- *(Optional)* Konfiguration des Projekts in Monorepos für die EsLint-  und/ oder Prettier-Regeln installiert werden sollen. 

Die optionalen Schritte werden während der Installation per CLI-Prompt abgefragt.

### ESLint

Bei der Installation wird optional eine `eslint.config.js` im Projektstamm angelegt, die die IsyFact ESLint-Regeln über `@isyfact/eslint-plugin` einbindet.
Die Konfiguration unterstützt sowohl einfache Angular-Projekte als auch Monorepos.
Für jedes Projekt werden separate Konfigurationsblöcke für TypeScript-, Spec- und HTML-Dateien generiert.

Die Linting-Prüfung kann mit folgendem Befehl ausgeführt werden:

```bash
npm run lint
```

Ist bereits eine `eslint.config.js` vorhanden, wird diese gesichert (`eslint.config.base.js`) und die IsyFact-Konfiguration als Wrapper darüber gelegt.

### Prettier

Bei der Installation wird optional eine `.prettierrc.js` im Projektstamm angelegt, die die IsyFact Prettier-Regeln über `@isyfact/prettier-plugin` einbindet.
Zusätzlich wird eine `.prettierignore` mit den IsyFact-Standardausschlüssen (z. B. `dist`, `node_modules`, `*.md`) erstellt.

Die Formatierung kann mit folgendem Befehl ausgeführt werden:

```bash
npm run format
```

Ist bereits eine `.prettierrc.js` vorhanden, wird sie nicht überschrieben.

### Voraussetzungen für Tailwind CSS 4

`isy-angular-widgets` verwendet Tailwind CSS v4 anstelle von PrimeFlex.

Falls Tailwind CSS im Zielprojekt noch nicht eingerichtet ist und die Konfiguration nicht durch `ng add @isyfact/isy-angular-widgets` erfolgt, werden zusätzlich folgende Pakete benötigt:

```bash
npm install tailwindcss @tailwindcss/postcss postcss tailwindcss-primeui
```

Zusätzlich muss eine Tailwind-Einstiegsdatei eingebunden werden, zum Beispiel `src/tailwind.css`:

```css
@import "tailwindcss";
@plugin "tailwindcss-primeui";
@source "../node_modules/@isyfact/isy-angular-widgets";
```

Die Datei muss in der `angular.json` unter `styles` eingebunden sein.

Beispiel:

```json
"styles": [
  "src/tailwind.css",
  "node_modules/primeicons/primeicons.css",
  "node_modules/@isyfact/isy-angular-widgets/assets/theme/isyfact-theme.scss",
  "src/styles.scss"
]
```

## Hauptfenster einbinden

Nach der Installation von `isy-angular-widgets` kann das Hauptfenster-Widget eingebunden werden.

Bei einem neu generierten Projekt kann dazu der Inhalt der Datei `app.html` beispielhaft mit folgendem Inhalt ersetzt werden:

```html
<isy-hauptfenster
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
  <p-menu
    Linksnavigation
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
    Inhalt des Informationsbereichs.
  </p>
</isy-hauptfenster>
```

Im nächsten Schritt werden die notwendigen Module und die Komponente `HauptfensterComponent`, `PanelModule` und `MenuModule` in der Datei `app.ts` importiert:

```typescript
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
export class AppComponent {}
```

Abschließend ist es erforderlich, in `app.config.ts` die Methode `provideIsyFactTheme` zu importieren und bereitzustellen:

```typescript
import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {provideIsyFactTheme} from '@isyfact/isy-angular-widgets';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideIsyFactTheme()]
};
```

## Migration von PrimeFlex auf Tailwind CSS

Bestehende Projekte sollten PrimeFlex-Utilities schrittweise durch Tailwind-Klassen ersetzen.

Typische Beispiele:

| PrimeFlex | Tailwind CSS |
|---|---|
| `grid grid-nogutter` | `grid grid-cols-* gap-0` |
| `col-12 md:col-6` | `col-span-12 md:col-span-6` |
| `p-mt-3` | `mt-3` |
| `p-d-flex` | `flex` |
| `p-jc-between` | `justify-between` |
| `p-ai-center` | `items-center` |

Normale komponentenspezifische `.scss`-Dateien bleiben davon unberührt.
Eine Anpassung ist dort nur erforderlich, wenn PrimeFlex-Klassen direkt verwendet oder nachgebildet wurden.

Die Bibliothek verwendet keine PrimeFlex-Utilities mehr und setzt stattdessen auf Tailwind CSS v4.

## Browser-Hinweis

Tailwind CSS v4 setzt moderne Browser voraus.
Vor der Einführung in bestehenden Projekten sollte geprüft werden, ob die Browser-Anforderungen des Zielprojekts damit vereinbar sind.

## Theme-Konfiguration

Die Bibliothek verwendet standardmäßig das PrimeNG-Theme `Nora` über `providePrimeNG()`.

Beim Aufruf von `provideIsyFactTheme()` kann optional ein anderes Theme übergeben werden.

### Beispiel: Theme-Konfiguration in `app.config.ts`

```typescript
import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideIsyFactTheme} from '@isyfact/isy-angular-widgets';
import Material from '@primeuix/themes/material';

export const appConfig: ApplicationConfig = {
  providers: [
    provideIsyFactTheme({theme: Material}),
    provideRouter([...])
  ]
};
```

Wird kein Theme angegeben, nutzt die Bibliothek standardmäßig `Nora`.

## I18N

`isy-angular-widgets` unterstützt die Übersetzungsfähigkeit in beliebigen Sprachen.
Standardmäßig werden die Widgets auf Deutsch dargestellt.

Beim Installer über `ng add @isyfact/isy-angular-widgets` werden automatisch deutsche und englische Übersetzungsdateien sowohl für PrimeNG als auch für `isy-angular-widgets` im `assets`-Verzeichnis angelegt.

### Beispielkonfiguration mit ngx-translate

Folgendes Beispiel zeigt, wie die Übersetzungsfähigkeit mit der Bibliothek `@ngx-translate` hergestellt werden kann.
Prinzipiell kann aber jede beliebige I18N-Bibliothek eingesetzt werden.

Zunächst wird `@ngx-translate` installiert:

```bash
npm install @ngx-translate/core @ngx-translate/http-loader --save
```

Im nächsten Schritt können die Übersetzungen von `@ngx-translate` in PrimeNG und `isy-angular-widgets` eingebunden werden.

Dazu müssen zunächst folgende Importe bereitgestellt werden, zum Beispiel in `app.config.ts`:

```typescript
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

Anschließend lassen sich die Übersetzungen für PrimeNG und `isy-angular-widgets` in der Datei `app.component.ts` bereitstellen. Dazu muss das erforderliche `TranslateModule` beispielsweise in der `app.component.ts` zur Verfügung gestellt werden.

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
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [HauptfensterComponent, PanelModule, MenuModule, TranslateModule]
})
export class AppComponent implements OnDestroy {
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

Die `translate`-Methode kann zum Beispiel auch für einen Language-Picker verwendet werden, damit Benutzer die Sprache der Anwendung selbst wählen können.

## Form-Wrapper

Der `Form-Wrapper` kapselt Formularfelder mit Label, Pflichtfeldkennzeichnung, Validierungsfehlern und Unterstützung für Barrierefreiheit.

Er wird mit **Reactive Forms** verwendet und unterstützt:

- native Felder wie `input`, `textarea` und `select`
- komplexe Komponenten über ein Adapter-Konzept
- automatische Synchronisation von `id`, `aria-describedby`, `aria-invalid` und `aria-errormessage` bei nativen Feldern

### Grundverwendung

```html
<form [formGroup]="myForm">
  <isy-form-wrapper
    label="E-Mail"
    fieldId="email"
    [control]="myForm.controls.email | formControl"
    [validationMessages]="{
      required: 'E-Mail ist erforderlich',
      email: 'Bitte geben Sie eine gültige E-Mail-Adresse ein'
    }"
  >
    <input isyFormWrapperField type="email" pInputText formControlName="email" />
  </isy-form-wrapper>
</form>
```

### Erforderliche Inputs

- `label`
- `fieldId`
- `control`

### Optionale Inputs

- `labelId` für eine eigene Label-ID
- `describedbyId` für zusätzliche Beschreibungen oder Hilfetexte
- `validationMessages` für validator-spezifische Fehlermeldungen

### Native Felder

Für native Felder wird empfohlen, `isyFormWrapperField` zu setzen:

```html
<isy-form-wrapper
  label="Vorname"
  fieldId="firstname"
  [control]="form.controls.firstname | formControl"
>
  <input isyFormWrapperField pInputText formControlName="firstname" />
</isy-form-wrapper>
```

Wenn `isyFormWrapperField` gesetzt ist, übernimmt der Wrapper automatisch:

- `id`
- `aria-describedby`
- `aria-invalid`
- `aria-errormessage`

Ohne `isyFormWrapperField` versucht der Wrapper als Fallback ein natives `input`, `textarea` oder `select` im Inhalt zu finden.

### Komplexe Komponenten

Komplexe Komponenten wie zum Beispiel `p-select` werden nicht automatisch über den nativen Fallback unterstützt.

Hier gibt es zwei Möglichkeiten:

- Die Komponente verwaltet Accessibility selbst.
- Es wird eine eigene Adapter-Directive bereitgestellt.

Beispiel mit manueller Anbindung:

```html
<isy-form-wrapper
  label="Geschlecht"
  labelId="label-gender"
  fieldId="gender"
  [control]="form.controls.gender | formControl"
>
  <p-select
    inputId="gender"
    ariaLabelledBy="label-gender"
    formControlName="gender"
    [options]="genderOptions"
  ></p-select>
</isy-form-wrapper>
```

### Typische Imports

```typescript
import {ReactiveFormsModule} from '@angular/forms';
import {FormWrapperComponent, FormWrapperFieldDirective} from '@isyfact/isy-angular-widgets';
```
