# isy-angular-widgets

[![Node.js CI](https://github.com/IsyFact/isy-angular-widgets/actions/workflows/node.js.yml/badge.svg)](https://github.com/IsyFact/isy-angular-widgets/actions/workflows/node.js.yml)

`isy-angular-widgets` ist eine Widget-Bibliothek, welche behördenspezifische Komponenten auf Basis von [PrimeNG](https://www.primefaces.org/primeng/) bereitstellt.
Die Bibliothek stellt zudem ein IsyFact-Theme bereit, welches sich nach den Richtlinien für Design und Barrierefreiheit des Bundes orientiert.

Praktische sowie querschnittliche Beispiele für die Umsetzung von Patterns des Styleguide sind in der Beispielanwendung [`isy-angular-widget-demo`](https://github.com/IsyFact/isy-angular-widgets/tree/main/projects/isy-angular-widgets-demo) zu finden.

## Hinweise zur Datumsvalidierung (ohne `moment.js`)

Für Datumsvalidierungen wird kein `moment.js` mehr verwendet – stattdessen basiert alles auf nativer `Date`-Logik.

Die Validatoren akzeptieren je nach Typ u. a.:
- JavaScript `Date`-Objekte
- ISO-Strings, z. B. `YYYY-MM-DD`, `YYYY-MM-DDTHH:mm:ssZ` bzw. mit Offset bei `isInFuture`/`isInPast`
- Bibliotheksformate wie `DD.MM.YYYY` sowie `DD-MM-YYYY` (nur bei `isInFuture`/`isInPast`)
- numerische Timestamps (`number`, z. B. `Date.now()`) - nur bei `isInFuture`/`isInPast`
- Moment-ähnliche Objekte mit `toDate()` (Backward-Compatibility für bestehende Consumer)

Wichtig: `isoDateTime` bleibt strikt und akzeptiert weiterhin ausschließlich das Format `YYYY-MM-DDTHH:mm:ssZ` mit literalem `Z` am Ende (UTC). DateTimes mit Offset wie `+01:00` bleiben dafür ungültig.

## Features

- Hauptfenster-Widget mit Seitenleisten, UserInfo und Navigation
- Standard Isyfact-Theme mit konfigurierbaren Farben für Hauptnavigationspunkte
- MegaMenu im Header
- Unterstützung für Rollen und Rechte
- Widget für die Anzeige eines ungewissen Datums mit Eingabemaske für das deutsche Datumsformat
- Security-Modul für die Beschränkung von Rechten auf Navigationspunkte
- Direktive zur Einschränkung der Sichtbarkeit von einzelnen Widgets
- Wizard-Widget
- Special-Char-Picker Widgets
- Spezifische Validator-Methoden für Input-Felder
- Form-Wrapper
- Skip-Links-Komponente für barrierefreies Springen zu Hauptinhalten
- Behördenspezifische Widgets und Widgets aus PrimeNG in deutscher und englischer Sprache

## Getting Started

Mit folgendem Befehl wird die Bibliothek `isy-angular-widgets` zu einem bestehenden Angular-Projekt hinzugefügt.

```
$ ng add @isyfact/isy-angular-widgets
```

Die Schematics führt folgende Schritte aus:
- Hinzufügen und Installation der Bibliothek und der notwendigen Abhängigkeiten
- Hinzufügen der Stylesheets der IsyFact
- Hinzufügen der Übersetzungsdateien für die Bibliothek und PrimeNG in deutscher und englischer Sprache

### Hauptfenster einbinden

Nach der Installation von `isy-angular-widgets` kann das Hauptfenster-Widget eingebunden werden.
Bei einem neu generierten Projekt kann dazu einfach der komplette Inhalt der Datei `app.component.html` mit folgendem Inhalt überschrieben werden:

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
  [applicationGroupColor]="'#458648'"
  [linksNavigationWidth]="'200px'"
  [logoAwl]="'{image-src}'"
  [logoAnbieterAwl]="'{image-src}'"
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
  <p Informationsbereich  class="p-2">
    Inhalt des Informationsbereich.
  </p>
</isy-hauptfenster>
```

Im nächsten Schritt werden die notwendigen Module und die Komponente `HauptfensterComponent`, `PanelModule` und `MenuModule` in der Datei `app.component.ts` importiert:

```typescript
// Other imports ...
import {Component} from '@angular/core';
import {HauptfensterComponent} from '@isyfact/isy-angular-widgets';
import {MenuModule} from 'primeng/menu';
import {PanelModule} from 'primeng/panel';

@Component({
  standalone: true,
  selector: 'app-root'
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [HauptfensterComponent, PanelModule, MenuModule]
})
export class AppComponent {}
```

Abschließend ist es erforderlich, in `app.config.ts` die Methoden `provideAnimations` und `provideIsyFactTheme` zu importieren und bereitzustellen:

```typescript
// Other imports ...
import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideIsyFactTheme} from '@isyfact/isy-angular-widgets';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimations(), provideIsyFactTheme()]
};
```

## Theme-Konfiguration

Die Bibliothek verwendet standardmäßig das PrimeNG-Theme `Nora` über `providePrimeNG()`.

Beim Aufruf von `provideIsyFactTheme()` kann ein Theme optional übergeben werden:

### Beispiel: Theme-Konfiguration in `app.config.ts`

```ts
import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideIsyFactTheme} from '@isyfact/isy-angular-widgets';
import Material from '@primeuix/themes/material';

export const appConfig: ApplicationConfig = {
  providers: [
    provideIsyFactTheme({ theme: Material }),
    provideRouter([...])
  ]
};
```
Wird kein Theme angegeben, nutzt die Bibliothek standardmäßig `Nora`.

## I18N

`isy-angular-widgets` unterstützt die Übersetzungsfähigkeit in beliebigen Sprachen.
Standardmäßig werden die Widgets auf Deutsch dargestellt.

Beim Installer über `ng add @isyfact/isy-angular-widgets` werden automatisch deutsche und englische Übersetzungsdateien, sowohl für PrimeNG als auch für `isy-angular-widgets`, im `asset` Verzeichnis angelegt.

### Beispielkonfiguration mit ngx-translate

Folgendes Beispiel zeigt, wie die Übersetzungsfähigkeit mit der Bibliothek `@ngx-translate` hergestellt werden kann.
Prinzipiell kann aber jede beliebige I18N-Bibliothek eingesetzt werden.

Zunächst wird `@ngx-translate` installiert.

```bash
npm install @ngx-translate/core @ngx-translate/http-loader --save
```

Im nächsten Schritt können die Übersetzungen von `@ngx-translate` in PrimeNG und `isy-angular-widgets` eingebunden werden.
Dazu müssen zunächst folgende Importe bereitgestellt werden, z.B. in `appConfig`: 
`provideHttpClient`, `provideTranslateService`, `provideTranslateLoader`, `provideTranslateHttpLoader`, `TranslateHttpLoader`

```typescript
// Other imports ...
import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideIsyFactTheme} from '@isyfact/isy-angular-widgets';
import {provideHttpClient} from '@angular/common/http';
import {provideTranslateHttpLoader, TranslateHttpLoader} from '@ngx-translate/http-loader';
import {provideTranslateLoader, provideTranslateService} from '@ngx-translate/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
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
import {Component, OnDestroy, OnInit} from '@angular/core';
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
export class AppComponent implements OnInit, OnDestroy {
  primeNgSub?: Subscription;
  widgetSub?: Subscription;

  private readonly primeng = inject(PrimeNG);
  private readonly widgetsConfigService = inject(WidgetsConfigService);
  readonly translateService = inject(TranslateService);

  constructor() {}

  ngOnInit(): void {
    this.translateService.setFallbackLang('en');

    this.translate('de');
  }

  translate(lang: string) {
    this.translateService.use(lang);
    this.primeNgSub = this.translateService
      .get('primeng')
      .subscribe((res) => this.primeng.setTranslation(res));
    this.widgetSub = this.translateService
      .get('isyAngularWidgets')
      .subscribe((res) => this.widgetsConfigService.setTranslation(res));
  }

  ngOnDestroy(): void {
    if (this.primeNgSub) {
      this.primeNgSub.unsubscribe();
    }
    if (this.widgetSub) {
      this.widgetSub.unsubscribe();
    }
  }
}
```
Die `translate`-Methode kann z.B. auch für einen Language-Picker verwenden werden, damit der Benutzer einer Seite die Sprache selber wählen kann.
