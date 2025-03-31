# isy-angular-widgets

[![Node.js CI](https://github.com/IsyFact/isy-angular-widgets/actions/workflows/node.js.yml/badge.svg)](https://github.com/IsyFact/isy-angular-widgets/actions/workflows/node.js.yml)

`isy-angular-widgets` ist eine Widget-Bibliothek, welche behördenspezifische Komponenten auf Basis von [PrimeNG](https://www.primefaces.org/primeng/) bereitstellt.
Die Bibliothek stellt zudem ein IsyFact-Theme bereit, welches sich nach den Richtlinien für Design und Barrierefreiheit des Bundes orientiert.

Praktische sowie querschnittliche Beispiele für die Umsetzung von Patterns des Styleguide sind in der Beispielanwendung [`isy-angular-widget-demo`](https://github.com/IsyFact/isy-angular-widgets/tree/main/projects/isy-angular-widgets-demo) zu finden.

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

Im nächsten Schritt werden die notwendigen Module und Komponente `HauptfensterComponent`, `PanelModule` und `MenuModule` in der Datei `app.component.ts` importiert:

```typescript
// Other imports ...
import {Component} from '@angular/core';
import {HauptfensterComponent} from '@isyfact/isy-angular-widgets';
import {MenuModule} from 'primeng/menu';
import {PanelModule} from 'primeng/panel';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HauptfensterComponent, PanelModule, MenuModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {}
```

Abschließend ist es erforderlich, in `app.config.ts` die Methode `provideIsyFactTheme` zu importieren und bereitzustellen, um Animationen zu aktivieren:

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
`provideHttpClient`, `importProvidersFrom`, `TranslateModule`, `HttpClient`, `TranslateHttpLoader`, `TranslateLoader`

```typescript
// Other imports ...
import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {provideIsyFactTheme} from '@isyfact/isy-angular-widgets';
import {HttpClient, provideHttpClient} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideIsyFactTheme(),
    provideHttpClient(),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: function HttpLoaderFactory(http: HttpClient) {
            return new TranslateHttpLoader(http);
          },
          deps: [HttpClient]
        }
      })
    )
  ]
};
```

Anschließend lassen sich die Übersetzungen für PrimeNG und `isy-angular-widgets` in der Datei `app.component.ts` bereitstellen. Dazu muss das erforderliche `TranslateModule` beispielsweise in der `app.component.ts` zur Verfügung gestellt werden.

```typescript
import {Component, OnDestroy, OnInit} from '@angular/core';
import {HauptfensterModule, WidgetsConfigService} from '@isyfact/isy-angular-widgets';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {PrimeNGConfig} from 'primeng/api';
import {MenuModule} from 'primeng/menu';
import {PanelModule} from 'primeng/panel';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HauptfensterModule, PanelModule, MenuModule, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  primeNgSub?: Subscription;
  widgetSub?: Subscription;

  constructor(
    private primeNgConfig: PrimeNGConfig,
    private widgetConfig: WidgetsConfigService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.translateService.setDefaultLang('en');

    this.translate('de');
  }

  translate(lang: string) {
    this.translateService.use(lang);
    this.primeNgSub = this.translateService
      .get('primeng')
      .subscribe((res) => this.primeNgConfig.setTranslation(res));
    this.widgetSub = this.translateService
      .get('isyAngularWidgets')
      .subscribe((res) => this.widgetConfig.setTranslation(res));
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
Die `translate`-Methode kann z.B. auch fr einen Language-Picker verwenden werden, damit def Benutzer einer Seite die Sprache selber wählen kann.

## Theme-Konfiguration

Die Bibliothek verwendet standardmäßig das PrimeNG-Theme `Nora` über `providePrimeNG()`.

Beim Aufruf von `provideIsyFactTheme()` kann ein Theme optional übergeben werden:

### Beispiel: Theme-Konfiguration in `app.config.ts`

```ts
import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideIsyFactTheme} from '@isyfact/isy-angular-widgets';
import Material from '@primeng/themes/Material';

export const appConfig: ApplicationConfig = {
  providers: [
    provideIsyFactTheme({ theme: Material }),
    provideRouter([...])
  ]
};
```
Wird kein Theme angegeben, nutzt die Bibliothek standardmäßig Nora.
