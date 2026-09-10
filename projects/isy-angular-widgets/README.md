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
  <a href="https://isyfact.github.io/isy-angular-widgets/">Demo-Anwendung</a> ·
  <a href="https://isyfact.github.io/isy-angular-widgets/documentation/">API-Dokumentation</a> ·
  <a href="./MIGRATION.md">Migration</a> ·
  <a href="https://github.com/IsyFact/isy-angular-widgets/blob/main/CHANGELOG.md">Changelog</a>
</p>

---

`isy-angular-widgets` stellt behördenspezifische Komponenten auf Basis von [PrimeNG](https://primeng.org/) bereit und unterstützt damit die Umsetzung von Frontends gemäß dem [IsyFact-Bedienkonzept](https://isyfact.github.io/isy-bedienkonzept-doc/current/bedienkonzept.html). Enthalten ist zudem ein IsyFact-Theme, das sich an den Richtlinien für Design und Barrierefreiheit des Bundes orientiert.

Diese Dokumentation richtet sich an Entwicklerinnen und Entwickler, die **die Bibliothek in einer eigenen Anwendung einsetzen**.

> Du möchtest die Bibliothek selbst weiterentwickeln? Dann ist die [README im Repository-Root](https://github.com/IsyFact/isy-angular-widgets/blob/main/README.md) der richtige Einstieg.

Praktische und querschnittliche Beispiele für die Umsetzung von Styleguide-Patterns zeigt die [Demo-Anwendung](https://isyfact.github.io/isy-angular-widgets/).

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
| [`HauptfensterComponent`](https://isyfact.github.io/isy-angular-widgets/documentation/components/HauptfensterComponent.html) | Komponente | Anwendungsrahmen mit Kopfbereich, Hauptnavigation, Titelzeile, Linksnavigation und Informationsbereich. Optional mit responsivem Verhalten. |
| [`SeitentoolbarComponent`](https://isyfact.github.io/isy-angular-widgets/documentation/components/SeitentoolbarComponent.html) | Komponente | Toolbar unterhalb der Titelzeile, etwa für Navigations- und Zurück-Buttons. |
| [`SkipLinksComponent`](https://isyfact.github.io/isy-angular-widgets/documentation/components/SkipLinksComponent.html) | Komponente | Sprungmarken, mit denen Tastatur- und Screenreader-Nutzende wiederkehrende Bereiche überspringen. |
| [`FormWrapperComponent`](https://isyfact.github.io/isy-angular-widgets/documentation/components/FormWrapperComponent.html) | Komponente | Kapselt ein Formularfeld mit Label, Pflichtfeldkennzeichnung, Fehlermeldung und der ARIA-Verdrahtung dazwischen. |
| [`IncompleteDateComponent`](https://isyfact.github.io/isy-angular-widgets/documentation/components/IncompleteDateComponent.html) | Komponente | Eingabefeld für vollständige und unvollständige Datumsangaben im Format `DD.MM.YYYY`; unbekannte Teile werden als `0` oder `x` erfasst. |
| [`InputCharComponent`](https://isyfact.github.io/isy-angular-widgets/documentation/components/InputCharComponent.html) | Komponente | Auswahldialog für Sonderzeichen, gegliedert nach Grundzeichen und Schriftzeichengruppen der DIN 91379. |
| [`WizardComponent`](https://isyfact.github.io/isy-angular-widgets/documentation/components/WizardComponent.html) | Komponente | Dialog zur schrittweisen Führung durch mehrstufige Eingaben. |
| [`SecurityDirective`](https://isyfact.github.io/isy-angular-widgets/documentation/directives/SecurityDirective.html) | Direktive | Blendet einzelne Bedienelemente wie Buttons abhängig von einem Recht ein oder aus. |
| [`FormWrapperFieldDirective`](https://isyfact.github.io/isy-angular-widgets/documentation/directives/FormWrapperFieldDirective.html) | Direktive | Kennzeichnet ein natives `input`, `textarea` oder `select` innerhalb eines Form-Wrappers für die automatische ARIA-Verdrahtung. |
| [`InputCharDirective`](https://isyfact.github.io/isy-angular-widgets/documentation/directives/InputCharDirective.html) | Direktive | Bindet den Sonderzeichen-Dialog an ein bestehendes Eingabefeld an. |
| [`WizardDirective`](https://isyfact.github.io/isy-angular-widgets/documentation/directives/WizardDirective.html) | Direktive | Definiert einen einzelnen Schritt innerhalb eines Wizards. |
| [`WizardFooterDirective`](https://isyfact.github.io/isy-angular-widgets/documentation/directives/WizardFooterDirective.html) | Direktive | Ersetzt den Fußbereich des Wizards durch eigene Bedienelemente. |
| [`SecurityService`](https://isyfact.github.io/isy-angular-widgets/documentation/injectables/SecurityService.html) | Service | Hält die Rechtekonfiguration und beantwortet Berechtigungsprüfungen für Routen und Elemente. |
| [`AuthGuard`](https://isyfact.github.io/isy-angular-widgets/documentation/injectables/AuthGuard.html) | Route-Guard | Verhindert beim Routing den Aufruf von Bereichen, für die das erforderliche Recht fehlt. |
| [`WidgetsConfigService`](https://isyfact.github.io/isy-angular-widgets/documentation/injectables/WidgetsConfigService.html) | Service | Stellt die Übersetzungen der Widget-Beschriftungen bereit und ermöglicht einen Sprachwechsel zur Laufzeit. |
| [`IncompleteDateService`](https://isyfact.github.io/isy-angular-widgets/documentation/injectables/IncompleteDateService.html) | Service | Wandelt unvollständige Datumsangaben in das deutsche Datumsformat um. |
| [`UserInfoService`](https://isyfact.github.io/isy-angular-widgets/documentation/injectables/UserInfoService.html) | Abstrakter Service | Schnittstelle, über die die Anwendung die Daten der angemeldeten Person bereitstellt. Die Implementierung – etwa der Serveraufruf – erfolgt im Zielprojekt. |
| [`Validation`](https://isyfact.github.io/isy-angular-widgets/documentation/classes/Validation.html) | Validator-Sammlung | Statische Validatoren für DIN 91379, unvollständige Datumsangaben, ISO-Datum und -Zeit sowie Kreditkartenangaben. |
| [`provideIsyFactTheme`](https://isyfact.github.io/isy-angular-widgets/documentation/miscellaneous/functions.html#provideIsyFactTheme) | Provider-Funktion | Registriert das IsyFact-Theme inklusive CSS-Layer-Reihenfolge in der Anwendungskonfiguration. |
| [`FormControlPipe`](https://isyfact.github.io/isy-angular-widgets/documentation/pipes/FormControlPipe.html) | Pipe | Typsichere Übergabe eines `AbstractControl` als `FormControl` im Template. |
| [`IncompleteDatePipe`](https://isyfact.github.io/isy-angular-widgets/documentation/pipes/IncompleteDatePipe.html) | Pipe | Formatiert unvollständige Datumsangaben für die Anzeige. |
| [`CorrelationIdHttpInterceptor`](https://isyfact.github.io/isy-angular-widgets/documentation/interceptors/CorrelationIdHttpInterceptor.html) | HTTP-Interceptor | Ergänzt ausgehende Requests um eine Korrelations-ID gemäß IsyFact-Vorgaben. |
| [`ZipkinOpenTracingHttpInterceptor`](https://isyfact.github.io/isy-angular-widgets/documentation/injectables/ZipkinOpenTracingHttpInterceptor.html) | HTTP-Interceptor | Ergänzt Requests um Tracing-Header nach dem OpenTracing-Standard in der Zipkin-Ausprägung. |

## Installation

Die Bibliothek setzt **Angular 22** voraus und wird über ihre Schematic zu einem bestehenden Angular-Projekt hinzugefügt:

```bash
npm install @isyfact/isy-angular-widgets --legacy-peer-deps
npx ng generate @isyfact/isy-angular-widgets:ng-add
npm install --legacy-peer-deps
```

Die Bibliothek verwendet weiterhin PrimeNG 21. Da PrimeNG 21 für Angular 21 entwickelt wurde, meldet `npm` einen Peer-Dependency-Konflikt (`ERESOLVE`). Deshalb ist in einem Angular-22-Projekt bei jeder Installation `--legacy-peer-deps` erforderlich – auch für später hinzugefügte Pakete.

> **Bekanntes Problem:** Die Schematic startet abschließend ein `npm install` ohne `--legacy-peer-deps`. Dieser Schritt schlägt in Angular-22-Projekten mit `ERESOLVE` fehl und die Angular CLI meldet `The Schematic workflow failed.`. Alle Dateien und Konfigurationen sind zu diesem Zeitpunkt bereits geschrieben, die Meldung kann daher ignoriert werden. Der abschließende Aufruf von `npm install --legacy-peer-deps` installiert die eingetragenen Abhängigkeiten und schließt die Installation ab.

Die Kombination aus Angular 22 und PrimeNG 21 ist im geprüften Projektumfang lauffähig, stellt jedoch keine offiziell deklarierte Versionskombination dar. Die tatsächlich verwendeten PrimeNG-Komponenten sollten in der eigenen Anwendung zusätzlich getestet werden – Hintergründe dazu stehen in der [MIGRATION.md](./MIGRATION.md).

### Was die Schematic einrichtet

- Eintragen der Bibliothek und der benötigten Abhängigkeiten in die `package.json`
- Einbinden der IsyFact-Styles
- Einbinden der Tailwind-CSS-Basis sowie der PrimeNG-Tailwind-Integration inklusive `.postcssrc.json`
- Hinzufügen der Übersetzungsdateien für die Bibliothek und PrimeNG in Deutsch und Englisch
- *(Optional)* Konfiguration der IsyFact-ESLint-Regeln über [`@isyfact/eslint-plugin`](https://github.com/IsyFact/isy-eslint-plugin)
- *(Optional)* Konfiguration der IsyFact-Prettier-Regeln über [`@isyfact/prettier-plugin`](https://github.com/IsyFact/isy-prettier-plugin)

Die beiden optionalen Schritte werden während der Installation per CLI-Prompt abgefragt. Beide sind standardmäßig aktiviert und lassen sich über die Schema-Optionen `addEslint` und `addPrettier` vorbelegen. Auf der Kommandozeile werden diese – wie bei der Angular CLI üblich – in Kebab-Case angegeben:

```bash
npx ng generate @isyfact/isy-angular-widgets:ng-add --add-eslint=false --add-prettier=false
```

In einem Monorepo richtet die Schematic Styles, Assets, Übersetzungen und die Tailwind-Einstiegsdatei für alle Anwendungsprojekte ein. Über das Flag `project` lässt sich die Einrichtung auf ein einzelnes Anwendungsprojekt begrenzen:

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

> **Wichtig:** Ein mit `ng new` erzeugtes Angular-22-Projekt enthält bereits eine `.prettierrc`. Diese hat bei der Konfigurationssuche von Prettier Vorrang vor der `.prettierrc.js`, sodass die IsyFact-Regeln ohne weiteres Zutun **nicht** greifen. Die von der Angular CLI erzeugte `.prettierrc` ist deshalb zu löschen. Welche Konfiguration tatsächlich verwendet wird, lässt sich so prüfen:
>
> ```bash
> npx prettier --find-config-path src/app/app.ts
> ```

```bash
npm run format
```

### Tailwind-CSS-Pakete manuell installieren

Die Bibliothek verwendet Tailwind CSS v4 für Utility-Klassen und `tailwindcss-primeui`, damit PrimeNG-Design-Tokens als Tailwind-Utilities zur Verfügung stehen. Über die Schematic wird das automatisch eingerichtet.

Ist Tailwind CSS im Zielprojekt noch nicht vorhanden und erfolgt die Einrichtung nicht über die Schematic, werden folgende Pakete benötigt:

```bash
npm install tailwindcss @tailwindcss/postcss postcss tailwindcss-primeui --legacy-peer-deps
```

Die anschließende Einbindung in das Projekt ist unter [Tailwind CSS manuell einbinden](#tailwind-css-manuell-einbinden) beschrieben.

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

### Tailwind CSS manuell einbinden

Nur erforderlich, wenn die Tailwind-Pakete [manuell installiert](#tailwind-css-pakete-manuell-installieren) wurden und die Einrichtung nicht über die Schematic erfolgt ist.

Benötigt wird eine Tailwind-Einstiegsdatei `src/tailwind.css`. Die Reihenfolge der `@layer`-Deklaration ist dabei entscheidend: Sie legt fest, dass das IsyFact-Theme die Styles von PrimeNG und Tailwind überschreiben kann.

```css
@layer theme, base, primeng, components, utilities, isyfact-theme;

@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/preflight.css" layer(base);
@import "tailwindcss/utilities.css" layer(utilities);

@plugin "tailwindcss-primeui";

@source "../node_modules/@isyfact/isy-angular-widgets";
```

Der `@source`-Pfad ist relativ zur Einstiegsdatei anzugeben und sorgt dafür, dass Tailwind die in der Bibliothek verwendeten Utility-Klassen erkennt.

Damit Tailwind CSS v4 die Datei beim Build verarbeitet, wird zusätzlich eine `.postcssrc.json` im Projektstamm benötigt. Ohne sie landen `@import`-, `@plugin`- und `@theme`-Anweisungen unverarbeitet im ausgelieferten CSS und es werden keine Utility-Klassen erzeugt:

```json
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
```

Die Einstiegsdatei muss außerdem in der `angular.json` unter `styles` eingebunden werden:

```json
"styles": [
  "src/styles.scss",
  "src/tailwind.css",
  "node_modules/primeicons/primeicons.css",
  "node_modules/@isyfact/isy-angular-widgets/assets/theme/isyfact-theme.scss"
]
```

Komponentenspezifische Styles in eigenen `.scss`-Dateien bleiben davon unberührt.

### Theming

Die Bibliothek liefert mit `provideIsyFactTheme()` ein vorkonfiguriertes PrimeNG-Theme aus. Als Standard dient das PrimeNG-Preset **Nora** mit Grau als Primärfarbe. Der Provider setzt zugleich die CSS-Layer-Reihenfolge (`theme, base, primeng, components, utilities, isyfact-theme`) und deaktiviert den Dark Mode.

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

### Print-Basis (optional)

Die Bibliothek liefert mit `assets/theme/isyfact-print.scss` eine allgemeine Basis für browserbasierte Ausdrucke im Format A4 hochkant. Sie ist bewusst nicht Bestandteil des normalen IsyFact-Themes: Anwendungen aktivieren sie nur dann, wenn sie die Print-Regeln verwenden möchten.

Das Print-Stylesheet kann in der `angular.json` nach den normalen Theme- und Drittanbieterstyles und vor den eigenen globalen Styles eingebunden werden:

```json
"styles": [
  "node_modules/@isyfact/isy-angular-widgets/assets/theme/isyfact-theme.scss",
  "node_modules/@isyfact/isy-angular-widgets/assets/theme/isyfact-print.scss",
  "src/styles.scss"
]
```

Die Reihenfolge ist relevant: Nachgeladene Anwendungsstyles können die Print-Basis innerhalb eines eigenen `@media print`-Blocks projektspezifisch erweitern oder überschreiben. Das ist beispielsweise für ein abweichendes Seitenformat oder fachlich breitere Tabellen sinnvoll:

```scss
@media print {
  @page {
    size: A4 landscape;
  }

  .application-wide-table {
    font-size: 7pt !important;
  }
}
```

Einige Regeln der Basis verwenden `!important`, um Bildschirmvorgaben von PrimeNG verlässlich aufzuheben. Projektspezifische Regeln sollten `!important` deshalb gezielt dort ebenfalls verwenden, wo eine solche Vorgabe überschrieben werden muss.

#### Print-Utilities

| Klasse | Zweck und Verwendung |
| --- | --- |
| `isy-print-hide` | Hat am Bildschirm keine Wirkung und blendet das markierte Element ausschließlich im Druck aus, zum Beispiel Navigation oder Aktionen. |
| `dont-print` | Verhält sich im Druck identisch zu `isy-print-hide` und bleibt als kompatibler Alias für bestehendes Markup unterstützt. |
| `isy-print-only` | Blendet das markierte Element am Bildschirm aus und zeigt es ausschließlich im Druck mit seinem elementtypischen Anzeigemodus, zum Beispiel als Druckkopf oder Tabellenhinweis. |
| `isy-print-content` | Setzt Breiten-, Abstands-, Hintergrund- und Überlaufvorgaben des markierten Inhaltsbereichs für den Druck zurück. Geschwister oder andere Seitenbereiche werden dadurch nicht ausgeblendet. |
| `isy-print-form` | Stellt das markierte Formular im Druck einspaltig dar, erhält die aktuell gerenderten Werte und entfernt die Interaktionsdekoration unterstützter Eingabe-Widgets. Fachlich irrelevante Aktionen müssen zusätzlich mit `isy-print-hide` markiert werden. |
| `isy-print-current-state` | Wird auf einen PrimeNG-Container für Tabs, Accordions, Panels oder Stepper gesetzt und druckt ausschließlich dessen aktuell sichtbaren Zustand. Die Klasse öffnet oder rendert keine geschlossenen Bereiche. |
| `isy-print-overlay` | Nimmt einen sichtbaren anwendungsspezifischen Overlay-Inhalt in den normalen Druckfluss auf. PrimeNG-Dialoge und -Drawer werden bereits ohne diese Zusatzklasse unterstützt; nicht gerenderte Overlays bleiben unsichtbar. |
| `isy-print-overlay-mask` | Wird bei einem anwendungsspezifischen Overlay auf dessen Maskenelement gesetzt und neutralisiert die Maske im Druck. Sie ist die öffentliche Begleitklasse zu `isy-print-overlay`; PrimeNG-Dialog- und Drawer-Masken werden bereits automatisch erkannt. |
| `isy-print-table` | Wird auf eine Tabelle oder ihren PrimeNG-Container gesetzt und optimiert sie für die verfügbare Seitenbreite, wiederholbare Tabellenköpfe und möglichst stabile Zeilenumbrüche. Aktionsspalten und anwendungsspezifische Bedienung müssen mit `isy-print-hide` markiert werden. |
| `isy-print-current-items` | Entfernt im markierten Bereich Scroll- und Virtualisierungsbegrenzungen, ohne den Anwendungszustand zu ändern oder weitere Datensätze zu laden. Gedruckt werden ausschließlich die aktuell im DOM gerenderten Einträge. |
| `isy-print-break-before` | Fordert im Druck vor dem markierten Element einen Seitenumbruch an; die Druckengine darf die Best-Effort-Regel bei technisch nicht erfüllbaren Umbrüchen abweichend behandeln. |
| `isy-print-break-after` | Fordert im Druck nach dem markierten Element einen Seitenumbruch an; die Druckengine darf die Best-Effort-Regel bei technisch nicht erfüllbaren Umbrüchen abweichend behandeln. |
| `isy-print-break-inside-avoid` | Fordert an, einen Seitenumbruch innerhalb des markierten Elements zu vermeiden; zu hohe Inhalte können von der Druckengine dennoch geteilt werden. |

Die Print-Basis bildet immer den aktuellen, bereits gerenderten Anwendungszustand ab:

- Bei Tabs wird nur der aktive Tab gedruckt; bei Accordions, Panels und Steppern bleiben geschlossene beziehungsweise inaktive Bereiche geschlossen.
- Nur geöffnete und gerenderte Dialoge oder Overlays können gedruckt werden. Masken und fachlich irrelevante Dialogaktionen werden entfernt, der sichtbare Inhalt wird in den Seitenfluss übernommen.
- Paginierte und virtualisierte Tabellen drucken nur die Datensätze der aktuellen Seite beziehungsweise die bereits gerenderten Datensätze. Die Print-Basis ändert weder Pagination noch Anwendungszustand und lädt keine weiteren Daten nach.

#### Bekannte Grenzen

Die allgemeinen Tabellenregeln sind in der Demo mit bis zu sieben sichtbaren fachlichen Spalten auf A4 hochkant geprüft. Breitere Tabellen benötigen eine fachlich reduzierte Spaltenauswahl oder anwendungsspezifische Regeln, beispielsweise A4 quer und eine kleinere Schrift. Wiederholte Tabellenköpfe sowie das Vermeiden von Umbrüchen innerhalb einer Zeile bleiben browserabhängige Best-Effort-Regeln; eine einzelne Zeile, die höher als der bedruckbare Bereich ist, kann geteilt werden.

Nicht gerenderte Seiten oder virtualisierte Datensätze können durch CSS nicht in den Ausdruck aufgenommen werden. Wenn ein vollständiger Datenexport erforderlich ist, muss die Anwendung dafür einen eigenen, datenbasierten Export- oder Druckpfad bereitstellen. Semantisch notwendige Diagrammfarben werden mit den CSS-Regeln für exakte Druckfarben erhalten, können aber zusätzlich von den Druckeinstellungen des Browsers oder Druckertreibers beeinflusst werden.

### Internationalisierung

`isy-angular-widgets` unterstützt beliebige Sprachen; standardmäßig werden die Widgets auf Deutsch dargestellt. Bei der Installation über die Schematic werden deutsche und englische Übersetzungsdateien für PrimeNG und die Bibliothek unter `src/assets/i18n` angelegt.

Das folgende Beispiel zeigt die Anbindung mit [`@ngx-translate`](https://ngx-translate.org/); prinzipiell kann jede I18N-Bibliothek eingesetzt werden.

```bash
npm install @ngx-translate/core @ngx-translate/http-loader --save --legacy-peer-deps
```

Zunächst werden die Provider bereitgestellt, zum Beispiel in `app.config.ts`:

```typescript
// Other imports ...
import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideHttpClient} from '@angular/common/http';
import {provideTranslateHttpLoader, TranslateHttpLoader} from '@ngx-translate/http-loader';
import {provideTranslateLoader, provideTranslateService} from '@ngx-translate/core';
import {provideIsyFactTheme} from '@isyfact/isy-angular-widgets';
import {routes} from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
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

> **Hinweis:** Mit `ng new` erzeugte Angular-22-Projekte sind standardmäßig zoneless und enthalten kein `zone.js`. Ein zusätzlich eingetragenes `provideZoneChangeDetection()` führt deshalb beim Start zum Fehler `NG0908: In this configuration Angular requires Zone.js`.

Anschließend werden die Übersetzungen für PrimeNG und die Bibliothek bereitgestellt, zum Beispiel in `app.ts`:

```typescript
import {ChangeDetectorRef, Component, OnDestroy, inject} from '@angular/core';
import {HauptfensterComponent, WidgetsConfigService} from '@isyfact/isy-angular-widgets';
import {TranslateService} from '@ngx-translate/core';
import {PrimeNG} from 'primeng/config';
import {MenuModule} from 'primeng/menu';
import {PanelModule} from 'primeng/panel';
import {Subscription} from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  imports: [HauptfensterComponent, PanelModule, MenuModule]
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

Sollen Texte direkt im Template übersetzt werden, werden zusätzlich `TranslatePipe` und `TranslateDirective` in die `imports` der Komponente aufgenommen. Bis einschließlich `@ngx-translate/core` 17 stand dafür `TranslateModule` zur Verfügung; ab Version 18 ist dieses Modul entfallen.

Die `translate`-Methode kann beispielsweise auch für einen Language-Picker verwendet werden, damit Benutzer die Sprache selbst wählen können.

#### ARIA-Beschriftungen

Auch die ARIA-Beschriftungen der Widgets stammen aus dem Übersetzungsbaum `isyAngularWidgets` und werden bei einem Sprachwechsel automatisch aktualisiert. Anwendungen können sie in ihren eigenen Übersetzungsdateien (`assets/i18n/de.json`, `assets/i18n/en.json`) überschreiben – dieselben Schlüssel gelten für jede weitere Sprache.

Für den Sonderzeichen-Picker stehen folgende Schlüssel zur Verfügung:

```json
{
  "isyAngularWidgets": {
    "inputChar": {
      "aria": {
        "togglePicker": "Sonderzeichenpicker öffnen",
        "closePicker": "Sonderzeichenpicker schließen",
        "characterGrid": "Sonderzeichenauswahl",
        "filterAllCharacters": "Alle Zeichen wählen",
        "filterBaseChars": "Basis-Zeichen wählen",
        "filterGroups": "Zeichengruppen wählen"
      },
      "preview": {
        "letters": "Zeichenvorschau",
        "information": "Zeicheninformationen"
      }
    }
  }
}
```

## Weiterführende Dokumentation

| Ressource | Inhalt |
|---|---|
| [API-Referenz (Compodoc)](https://isyfact.github.io/isy-angular-widgets/documentation/) | Alle Komponenten, Direktiven und Services mit Inputs, Outputs und Beispielen |
| [IsyFact-Bedienkonzept](https://isyfact.github.io/isy-bedienkonzept-doc/current/bedienkonzept.html) | Fachliche und gestalterische Vorgaben, die den Widgets zugrunde liegen |
| [Demo-Anwendung](https://isyfact.github.io/isy-angular-widgets/) | Lauffähige Beispiele der Widgets und Styleguide-Patterns |


## Migration auf eine neue Version

Breaking Changes und Migrationshinweise für jeden Versionssprung stehen in der [MIGRATION.md](./MIGRATION.md) – darunter auch die Umstellung von PrimeFlex auf Tailwind CSS.

Eine vollständige Liste aller Änderungen enthält das [CHANGELOG.md](https://github.com/IsyFact/isy-angular-widgets/blob/main/CHANGELOG.md).
