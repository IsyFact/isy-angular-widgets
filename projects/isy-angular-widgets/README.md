# isy-angular-widgets

[![Node.js CI](https://github.com/IsyFact/isy-angular-widgets/actions/workflows/node.js.yml/badge.svg)](https://github.com/IsyFact/isy-angular-widgets/actions/workflows/node.js.yml)

`isy-angular-widgets` ist eine Widget-Bibliothek, welche Behördenspezifische Komponenten auf Basis von [PrimeNG](https://www.primefaces.org/primeng/) bereitstellt.
Die Bibliothek stellt zudem ein IsyFact Theme bereit, welches sich nach den Richtlinien für Design und Barrierefreiheit des Bundes orientiert.

## Getting Started

Mit folgendem Befehl wird die Bibliothek `isy-angular-widgets` zu einem bestehenden Angular Projekt hinzugefügt.

```
$ ng add @isyfact/isy-angular-widgets
```

Die Schematics führt folgende Schritte aus:
- Hinzufügen und Installation der Bibliothek und der notwendigen Abhängigkeiten
- Hinzufügen der Stylesheets der IsyFact
- Hinzufügen der Übersetzungsdateien für die Bibliothek und PrimeNG in deutscher und englischer Sprache

### Hauptfenster einbinden

Nach der Installation von `isy-angular-widget` kann das Hauptfenster Widget eingebunden werden.
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

Je nach IDE müssen die Importe für das Hauptfenster Modul noch manuell in der `app.module.ts` ergänzt werden.

```typescript
// Other imports ...
import {HauptfensterModule} from '@isyfact/isy-angular-widgets';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    // Other imports ...
    BrowserModule,
    BrowserAnimationsModule,
    HauptfensterModule,
    MenuModule,
    PanelModule
  ]
})
export class AppModule {
}
```

## I18N

`isy-angular-widgets` unterstützt die Übersetzungsfähigkeit in beliebige Sprachen.
Standardmäßig werden die Widgets auf Deutsch dargestellt.

Beim Installer über `ng add @isyfact/isy-angular-widgets` werden automatisch deutsche und englische Übersetzungsdateien sowohl für PrimeNG als auch für `isy-angular-widgets` im `asset` Verzeichnis angelegt.

### Beispielkonfiguration mit ngx-translate

Folgendes Beispiel zeigt, wie die Übersetzungsfähigkeit mit der Bibliothek `@ngx-translate` hergestellt werden kann.
Prinzipiell kann aber jede beliebige I18N-Bibliothek eingesetzt werden.

Zunächst wird `@ngx-translate` installiert.

```bash
npm install @ngx-translate/core@14 @ngx-translate/http-loader@7 --save
```

Anschließend können die Übersetzungen von `@ngx-translate` in PrimeNG und `isy-angular-widgets` eingebunden werden.
Dazu wird zunächst das `TranslateModule` in der Datei `app.module.ts` installiert.

```typescript
// Other imports ...
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from "@ngx-translate/http-loader";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    // Other imports ...
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: function HttpLoaderFactory(http: HttpClient) {
          return new TranslateHttpLoader(http);
        },
        deps: [HttpClient]
      }
    })
  ]
})
export class AppModule {
}
```

Anschließend können in der Datei `app.component.ts` die Übersetzungen für PrimeNG und `isy-angular-widgets` bereitgestellt werden.

```typescript
import {Component, OnDestroy, OnInit} from '@angular/core';
import {PrimeNGConfig} from "primeng/api";
import {WidgetsConfigService} from "@isyfact/isy-angular-widgets";
import {TranslateService} from "@ngx-translate/core";
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  primeNgSub?: Subscription
  widgetSub?: Subscription

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
    this.primeNgSub =this.translateService.get('primeng')
      .subscribe(res => this.primeNgConfig.setTranslation(res));
    this.widgetSub = this.translateService.get('isyAngularWidgets')
      .subscribe(res => this.widgetConfig.setTranslation(res));
  }

  ngOnDestroy(): void {
    if(this.primeNgSub) {
      this.primeNgSub.unsubscribe();
    }
    if(this.widgetSub) {
      this.widgetSub.unsubscribe();
    }
  }
}
```
Die `translate`-Methode kann z.B. auch fr einen Language-Picker verwenden werden, damit def Benutzer einer Seite die Sprache selber wählen kann.

## Development Setup

### Prerequisites

Auf dem PC müssen die neueste [Node und Npm LTS Version](https://nodejs.org/en/download/) installiert sein.


Anschließend muss das Projekt aus GitHub bezogen werden

```shell
git clone https://github.com/IsyFact/isy-angular-widgets.git
cd isy-angular-widget
```

### Dependencies Installieren

Vor der ersten Ausführung, bzw. beim Ergänzen neuer Pakete muss das Projekt mit folgendem Befehl installiert werden.

```shell
npm install
```

### Demo Anwendung starten

Neben den Widgets können in der Demo Anwendung praktische Beispiele für die Umsetzung von Styleguide Patterns oder querschnittlichen Aspekten betrachtet werden.
Die Demo Anwendung kann mit folgendem Befehl gestartet werden. 

```
$ npm run start
```

#### E2E Tests für Demoanwendung ausführen

Für die Demoanwendung wurden exemplarisch einige E2E-Tests mit dem Framework [TestCafe](https://testcafe.io/) umgesetzt.
Um die Tests auszuführen, muss zunächst die Demoanwendung gestartet werden (siehe oben).
Für die Ausführung der Tests wird der Webbrowser Chrome benötigt, alternativ kann das `e2e` Skript angepasst und dort ein anderer Browser eingetragen werden.
Die Tests werden mit folgendem Befehlt gestartet.

```
$ npm run e2e
```

### PrimeNG Designer
Die globalen Styles (isyfact-primeng-bootstrap-light.css) werden vom [PrimeNG Theme Designer](https://designer.primeng.org/#/) generiert.


Als Basis Theme wird _Bootstrap Light_ verwendet.
Für das aktuelle Theme wurden folgende Einstellungen im PrimeNG Theme Designer verwenden:

| Einstellungen        | Wert                          | 
|----------------------|-------------------------------|
| *General*            |                               |
| Font Family          | BundesSans,Calibri,sans-serif |
| Text                 | 73, 80, 87                    |
| Border Radius        | 0px                           |
| *Palette*            |                               |
| Primary              | 69, 72, 77                    |
| Primary Dark         | 137, 144, 154                 |
| Primary Darker       | 137, 144, 154                 |
| Highlight Background | 204, 227, 236                 |
| Text on Highlight    | 73, 80, 87                    |
| *Forms*              |                               |
| Focus Border         | 204, 227, 236                 |
