<h1 align="center">
  <a href="https://www.bva.bund.de/DE/Das-BVA/Aufgaben/I/Informationstechnik/IsyFact/isyfact_node.html">
    <img src="https://raw.githubusercontent.com/IsyFact/isy-angular-widgets/main/.github/assets/logo-isyfact.jpg" alt="IsyFact" width="340">
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
  <a href="https://isyfact.github.io/isy-angular-widgets/">Demo-Anwendung</a> ·
  <a href="https://isyfact.github.io/isy-angular-widgets/documentation/">API-Dokumentation</a> ·
  <a href="./MIGRATION.md">Migration</a> ·
  <a href="https://github.com/IsyFact/isy-angular-widgets/blob/main/CHANGELOG.md">Changelog</a>
</p>

---

`isy-angular-widgets` stellt behördenspezifische Komponenten auf Basis von [PrimeNG](https://primeng.org/) bereit. Enthalten ist zudem ein IsyFact-Theme, das sich an den Richtlinien für Design und Barrierefreiheit des Bundes orientiert.

Diese Dokumentation richtet sich an Entwicklerinnen und Entwickler, die **die Bibliothek in einer eigenen Anwendung einsetzen**.

> Du möchtest die Bibliothek selbst weiterentwickeln? Dann ist die [README im Repository-Root](https://github.com/IsyFact/isy-angular-widgets/blob/main/README.md) der richtige Einstieg.

Praktische und querschnittliche Beispiele für die Umsetzung von Styleguide-Patterns zeigt die [Demo-Anwendung](https://isyfact.github.io/isy-angular-widgets/).

## Inhalt

- [Features](#features)
- [Installation](#installation)
- [Erste Schritte: Hauptfenster einbinden](#erste-schritte-hauptfenster-einbinden)
- [Konfiguration](#konfiguration)
- [Widgets im Detail](#widgets-im-detail)
- [Browser-Unterstützung](#browser-unterstützung)
- [Migration auf eine neue Version](#migration-auf-eine-neue-version)

## Features

- Hauptfenster-Widget mit Seitenleisten, UserInfo und Navigation
- Standard-IsyFact-Theme mit konfigurierbaren Farben für Hauptnavigationspunkte
- MegaMenu im Header
- Unterstützung für Rollen und Rechte
- Widget für die Anzeige eines ungewissen Datums mit Eingabemaske für das deutsche Datumsformat
- Security-Modul für die Beschränkung von Rechten auf Navigationspunkte
- Direktive zur Einschränkung der Sichtbarkeit einzelner Widgets
- Wizard-Widget
- Special-Char-Picker-Widgets
- Spezifische Validator-Methoden für Eingabefelder
- Form-Wrapper
- Skip-Links-Komponente für barrierefreies Springen zu Hauptinhalten
- Behördenspezifische Widgets und Widgets aus PrimeNG in deutscher und englischer Sprache

## Installation

Die Bibliothek wird über ihre Schematic zu einem bestehenden Angular-Projekt hinzugefügt.

**Angular 21:**

```bash
ng add @isyfact/isy-angular-widgets
```

**Angular 22:**

```bash
npm install @isyfact/isy-angular-widgets --legacy-peer-deps
npx ng generate @isyfact/isy-angular-widgets:ng-add
npm install --legacy-peer-deps
```

Die Bibliothek unterstützt Angular 21 und Angular 22, verwendet aber weiterhin PrimeNG 21. Da PrimeNG 21 für Angular 21 entwickelt wurde, meldet `npm` in Angular-22-Projekten einen Peer-Dependency-Konflikt. Die Schematic überspringt in diesem Fall den automatischen Package-Install und gibt einen Hinweis aus; die Installation wird anschließend manuell mit `--legacy-peer-deps` ausgeführt.

Die Kombination aus Angular 22 und PrimeNG 21 ist im geprüften Projektumfang lauffähig, stellt jedoch keine offiziell deklarierte Versionskombination dar. Die tatsächlich verwendeten PrimeNG-Komponenten sollten in der eigenen Anwendung zusätzlich getestet werden – Hintergründe dazu stehen in der [MIGRATION.md](./MIGRATION.md).

### Was die Schematic einrichtet

- Hinzufügen und Installation der Bibliothek sowie der benötigten Abhängigkeiten
- Einbinden der IsyFact-Styles
- Einbinden der Tailwind-CSS-Basis sowie der PrimeNG-Tailwind-Integration
- Hinzufügen der Übersetzungsdateien für die Bibliothek und PrimeNG in Deutsch und Englisch
- *(Optional)* Konfiguration der IsyFact-ESLint-Regeln über `@isyfact/eslint-plugin`
- *(Optional)* Konfiguration der IsyFact-Prettier-Regeln über `@isyfact/prettier-plugin`
- *(Optional)* Auswahl der Projekte, für die in Monorepos ESLint und/oder Prettier eingerichtet werden

Die optionalen Schritte werden während der Installation per CLI-Prompt abgefragt.

#### ESLint

Optional wird eine `eslint.config.js` im Projektstamm angelegt, die die IsyFact-ESLint-Regeln einbindet. Unterstützt werden einfache Angular-Projekte und Monorepos; für jedes Projekt entstehen passende Konfigurationsblöcke für TypeScript-, Spec- und HTML-Dateien. Zusätzlich wird ein `lint`-Script in der `package.json` ergänzt.

Eine bereits vorhandene `eslint.config.js` wird als `eslint.config.base.js` gesichert und in die neue Konfiguration eingebunden.

```bash
npm run lint
```

#### Prettier

Optional wird eine `.prettierrc.js` angelegt, die die IsyFact-Prettier-Regeln einbindet. Ergänzt werden zudem eine `.prettierignore` mit den IsyFact-Standardausschlüssen und ein `format`-Script in der `package.json`.

Eine bereits vorhandene `.prettierrc.js` wird nicht überschrieben. Das Prettier-Setup ist standardmäßig aktiviert und lässt sich über das Schema-Flag `addPrettier` steuern.

```bash
npm run format
```

### Tailwind CSS manuell einrichten

Die Bibliothek verwendet Tailwind CSS v4 für Utility-Klassen und `tailwindcss-primeui`, damit PrimeNG-Design-Tokens als Tailwind-Utilities zur Verfügung stehen. Bei der Installation über `ng add` wird das automatisch eingerichtet.

Ist Tailwind CSS im Zielprojekt noch nicht eingerichtet und erfolgt die Konfiguration nicht über die Schematic, werden folgende Pakete benötigt:

```bash
npm install tailwindcss @tailwindcss/postcss postcss tailwindcss-primeui
```

Zusätzlich wird eine Tailwind-Einstiegsdatei `src/tailwind.css` benötigt. Die Reihenfolge der `@layer`-Deklaration ist dabei entscheidend: Sie legt fest, dass das IsyFact-Theme die Styles von PrimeNG und Tailwind überschreiben kann.

```css
@layer theme, base, primeng, components, utilities, isyfact-theme;

@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/preflight.css" layer(base);
@import "tailwindcss/utilities.css" layer(utilities);

@plugin "tailwindcss-primeui";

@source "../node_modules/@isyfact/isy-angular-widgets";
```

Der `@source`-Pfad ist relativ zur Einstiegsdatei anzugeben und sorgt dafür, dass Tailwind die in der Bibliothek verwendeten Utility-Klassen erkennt.

Diese Datei muss in der `angular.json` unter `styles` eingebunden werden:

```json
"styles": [
  "src/styles.scss",
  "src/tailwind.css",
  "node_modules/primeicons/primeicons.css",
  "node_modules/@isyfact/isy-angular-widgets/assets/theme/isyfact-theme.scss"
]
```

Komponentenspezifische Styles in eigenen `.scss`-Dateien bleiben davon unberührt.

## Erste Schritte: Hauptfenster einbinden

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

## Konfiguration

### Theme

Die Bibliothek liefert mit `provideIsyFactTheme()` ein vorkonfiguriertes PrimeNG-Theme aus. Als Standard dient das PrimeNG-Preset **Nora** mit Grau als Primärfarbe. Der Provider setzt zugleich die CSS-Layer-Reihenfolge (`theme, base, primeng, components, utilities, isyfact-theme`) und deaktiviert den Dark Mode.

Optional lässt sich ein abweichendes Preset als Argument übergeben:

```typescript
import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideIsyFactTheme} from '@isyfact/isy-angular-widgets';
import Material from '@primeuix/themes/material';

export const appConfig: ApplicationConfig = {
  providers: [
    provideIsyFactTheme(Material),
    provideRouter([...])
  ]
};
```

Eigene Presets können mit `definePreset()` aus `@primeuix/themes` erstellt und ebenso übergeben werden.

### Internationalisierung

`isy-angular-widgets` unterstützt beliebige Sprachen; standardmäßig werden die Widgets auf Deutsch dargestellt. Bei der Installation über `ng add` werden deutsche und englische Übersetzungsdateien für PrimeNG und die Bibliothek im `assets`-Verzeichnis angelegt.

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

Die `translate`-Methode kann beispielsweise auch für einen Language-Picker verwendet werden, damit Benutzer die Sprache selbst wählen können.

## Widgets im Detail

Eine vollständige API-Referenz aller Komponenten, Direktiven und Services steht in der [Compodoc-Dokumentation](https://isyfact.github.io/isy-angular-widgets/documentation/).

### Hauptfenster: responsive Darstellung

Das responsive Verhalten des Hauptfensters ist standardmäßig deaktiviert und wird über das Boolean-Attribut `responsive` aktiviert:

```html
<isy-hauptfenster
  responsive
  [showLinksnavigation]="true"
  [showInformationsbereich]="true"
>
  <p-menu Linksnavigation [model]="navigationItems"></p-menu>

  <main>
    Zentraler Inhaltsbereich
  </main>

  <p Informationsbereich>
    Zusätzliche Informationen
  </p>
</isy-hauptfenster>
```

Ist `responsive` gesetzt, reagiert das Hauptfenster auf seine verfügbare Breite:

- Bei einer Breite von höchstens `1024 px` werden Linksnavigation und Informationsbereich automatisch ausgeblendet.
- Der zentrale Inhaltsbereich bleibt sichtbar und nutzt die verfügbare Breite.
- Wird das Hauptfenster wieder breiter als `1024 px`, erscheinen die Seitenbereiche entsprechend `showLinksnavigation` und `showInformationsbereich` erneut.
- Die Werte von `collapsedLinksnavigation` und `collapsedInformationsbereich` bleiben unverändert.

Das Attribut kann auch dynamisch gesetzt werden:

```html
<isy-hauptfenster
  [responsive]="responsiveLayoutEnabled"
  [showLinksnavigation]="true"
  [showInformationsbereich]="true"
>
  <!-- Inhalte -->
</isy-hauptfenster>
```

Ohne das Attribut bleibt das bisherige Verhalten unverändert. Da die responsive Darstellung auf der Breite der Komponente basiert, funktioniert sie auch innerhalb eines schmaleren Containers.

### Seiten-Toolbar: responsive Darstellung

Auch bei der Seiten-Toolbar ist das responsive Verhalten standardmäßig deaktiviert und wird über `responsive` aktiviert:

```html
<isy-seiten-toolbar
  responsive
  [showSidebar]="true"
  sidebarHomeButtonLabel="Zurück"
  sidebarHomeButtonAriaLabel="Zurück zur Übersicht"
/>
```

Bei einer Bildschirmbreite von höchstens `320 px` wird das sichtbare Label des Home-/Zurück-Buttons ausgeblendet. Icon und Accessible Label bleiben erhalten. Ohne `responsive` bleibt das sichtbare Label auch bei schmalen Bildschirmbreiten erhalten.

### Form-Wrapper

Der Form-Wrapper kapselt Formularfelder mit Label, Pflichtfeldkennzeichnung, Validierungsfehlern und Unterstützung für Barrierefreiheit. Er wird mit **Reactive Forms** verwendet und unterstützt:

- native Felder wie `input`, `textarea` und `select`
- komplexe Komponenten über ein Adapter-Konzept
- automatische Synchronisation von `id`, `aria-describedby`, `aria-invalid` und `aria-errormessage` bei nativen Feldern

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

**Erforderliche Inputs:** `label`, `fieldId`, `control`

**Optionale Inputs:**

- `labelId` für eine eigene Label-ID
- `describedbyId` für zusätzliche Beschreibungen oder Hilfetexte
- `validationMessages` für validator-spezifische Fehlermeldungen

#### Native Felder

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

Ist `isyFormWrapperField` gesetzt, übernimmt der Wrapper automatisch `id`, `aria-describedby`, `aria-invalid` und `aria-errormessage`. Ohne die Direktive sucht der Wrapper als Fallback ein natives `input`, `textarea` oder `select` im Inhalt.

#### Komplexe Komponenten

Komplexe Komponenten wie `p-select` werden vom nativen Fallback nicht automatisch unterstützt. Entweder verwaltet die Komponente Accessibility selbst, oder es wird eine eigene Adapter-Directive bereitgestellt.

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

#### Typische Imports

```typescript
import {ReactiveFormsModule} from '@angular/forms';
import {FormWrapperComponent, FormWrapperFieldDirective} from '@isyfact/isy-angular-widgets';
```

### Validatoren für Datumsangaben

Die Datumsvalidierung der Bibliothek kommt ohne `moment.js` aus. Die Validatoren akzeptieren je nach Typ unter anderem:

- JavaScript-`Date`-Objekte
- ISO-Strings, zum Beispiel `YYYY-MM-DD` oder `YYYY-MM-DDTHH:mm:ssZ`, bei `isInFuture` und `isInPast` auch mit Offset
- Bibliotheksformate wie `DD.MM.YYYY` und `DD-MM-YYYY`, nur bei `isInFuture` und `isInPast`
- numerische Timestamps, zum Beispiel `Date.now()`, nur bei `isInFuture` und `isInPast`
- Moment-ähnliche Objekte mit `toDate()` als Backward-Compatibility für bestehende Anwendungen

> **Wichtig:** `isoDateTime` bleibt strikt und akzeptiert ausschließlich `YYYY-MM-DDTHH:mm:ssZ` mit literalem `Z` am Ende. DateTimes mit Offset wie `+01:00` sind dort ungültig.

## Browser-Unterstützung

Tailwind CSS v4 setzt moderne Browser voraus. Vor der Einführung in bestehenden Projekten sollte geprüft werden, ob die Browser-Anforderungen des Zielprojekts damit vereinbar sind.

Das Hauptfenster prüft beim Laden der Anwendung zusätzlich, ob die verwendete Browser-Version unterstützt wird, und zeigt andernfalls eine Warnmeldung an. Die Prüfung ist standardmäßig aktiviert und lässt sich über das Input-Property `checkBrowserVersion` deaktivieren:

```html
<isy-hauptfenster [checkBrowserVersion]="false">
  <!-- Anwendungscode -->
</isy-hauptfenster>
```

Die Texte der Warnmeldung sind über den `WidgetsConfigService` konfigurierbar.

## Migration auf eine neue Version

Breaking Changes und Migrationshinweise für jeden Versionssprung stehen in der [MIGRATION.md](./MIGRATION.md) – darunter auch die Umstellung von PrimeFlex auf Tailwind CSS.

Eine vollständige Liste aller Änderungen enthält das [CHANGELOG.md](https://github.com/IsyFact/isy-angular-widgets/blob/main/CHANGELOG.md).
