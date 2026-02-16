# Update Log - 06.02.2026

## Entfernung von Moment.js (Validierung & Tests)

### 1. Änderung
- Moment.js wird in der Bibliothek nicht mehr verwendet.
- Unit-Tests verwenden kein Moment.js mehr.

### 2. Auswirkungen / Migration
- **Moment.js ist keine (Peer-)Abhängigkeit mehr.**
- Consumer können weiterhin Moment-Objekte verwenden, sofern `toDate()` verfügbar ist (Backward Compatibility).
  - Empfehlung: Übergabe von `Date` oder ISO-Strings.

### 3. Unterstützte Eingabeformate (Validierung)
- `isInFuture` / `isInPast` akzeptieren:
  - `Date`
  - ISO-Date-Only (`YYYY-MM-DD`)
  - ISO-DateTime mit `Z` oder Offset (z. B. `2099-12-31T00:00:00+01:00`)
  - `DD.MM.YYYY`
  - `DD-MM-YYYY` (primär interpretiert als `DD-MM-YYYY`, fallback optional als `MM-DD-YYYY`)
  - `number` (Timestamp)
  - Moment-ähnliche Objekte mit `toDate()`

- `dateFormat(...)` unterstützt die in der Bibliothek verwendeten Formate (u. a. `YYYY-MM-DD`, `DD.MM.YYYY`, `HH:mm:ss`, `YYYY-MM-DDTHH:mm:ss[Z]`, `MM/YY`) und akzeptiert zusätzlich `Date` sowie Moment-ähnliche Objekte via `toDate()`.

**Wichtig:** `isoDateTime` bleibt strikt und akzeptiert nur `YYYY-MM-DDTHH:mm:ssZ` mit literalem `Z` am Ende (UTC). Offsets wie `+01:00` sind ungültig.


# Update Log - 08.08.2025

## Migration auf Angular v20 & PrimeNG v20

### 1. Aktualisierte Frameworks & Tools
- Angular: v19 → **v20.1.1**
- PrimeNG: v19 → **v20.0.0**
- Core-Pakete & CLI aktualisiert
- Migrationshinweise von [update.angular.io](https://update.angular.io) und [PrimeNG Migration Guide](https://primeng.org/migration/v20) umgesetzt

---

### 2. **Breaking Changes**

#### Umstellung auf Flat Config-Format (ESLint)
- Das isy-eslint-plugin nutzt nun das Flat Config-Format, was eine Umstellung der Projektkonfiguration auf eslint.config.js erfordert
- Die Nutzung von .eslintrc.js oder .eslintrc.json ist nicht mehr möglich
- Die Konfiguration muss auf eslint.config.js umgestellt werden und ist im [Migration Guide](https://eslint.style/guide/migration) nachzulesen

#### Umstellung auf inject()
- Einführung von inject() statt der traditionellen DI im Konstruktor in Angular
- Anpassungen an bestehenden Komponenten oder Services sind möglicherweise erforderlich
- Falls die Umstellung auf [inject()](https://angular.dev/reference/migrations/inject-function) nicht gewünscht ist, kann dies durch die Regel @angular-eslint/no-inject-in-constructor: 'off' in der ESLint-Konfiguration deaktiviert werden 

####  Ersetzung von @primeng/themes durch @primeuix/themes
- Das Ersetzen von @primeng/themes durch @primeuix/themes erfordert Anpassungen an Imports, Styles und Konfigurationen
- Paketname, API, Struktur und Build-Konfiguration ändern sich. Möglicherweise müssen auch andere Abhängigkeiten aktualisiert werden
- Imports und Konfigurationen auf das neue Paket anpassen

#### Upgrade von ngx-translate von v16 auf v17
- Das Upgrade auf Version 17 könnte API-Änderungen oder neue Konfigurationen beinhalten
- Es könnten Anpassungen erforderlich sein
- Details und spezifische Breaking Changes sind im [Migration Guide](https://ngx-translate.org/getting-started/migration-guide/) nachzulesen

#### Upgrade von Spectator von v19.6.2 auf v21.0.1
- Das Upgrade könnte API-Änderungen oder neue Funktionen beinhalten
- Möglicherweise sind Anpassungen erforderlich
- Weitere Details und spezifische Breaking Changes sind im [Changelog](https://github.com/ngneat/spectator/blob/master/CHANGELOG.md) nachzulesen

---

### 3. Änderungen in **_isy-angular-widgets_** (Bibliothek)

#### Paketkonfiguration (`index.ts`)
```ts
addPackageToPackageJson(tree, '@angular/common', '^20.1.6');
addPackageToPackageJson(tree, '@angular/core', '^20.1.6');
addPackageToPackageJson(tree, 'primeng', '^20.0.1');
addPackageToPackageJson(tree, '@primeuix/themes', '^1.2.3');
```

---

### 4. Aktualisierte Abhängigkeiten

#### Demo-App (`package.json`)
```json
{
    "dependencies": {
        "@angular/animations": "^20.1.6",
        "@angular/cdk": "^20.1.5",
        "@angular/common": "^20.1.6",
        "@angular/compiler": "^20.1.6",
        "@angular/core": "^20.1.6",
        "@angular/forms": "^20.1.6",
        "@angular/platform-browser": "^20.1.6",
        "@angular/platform-browser-dynamic": "^20.1.6",
        "@angular/router": "^20.1.6",
        "@ngx-translate/core": "^17.0.0",
        "@ngx-translate/http-loader": "^17.0.0",
        "@primeuix/themes": "^1.2.3",
        "chart.js": "^4.5.0",
        "flag-icons": "^7.5.0",
        "primeflex": "^4.0.0",
        "primeng": "^20.0.1",
    },
    "devDependencies": {
        "@angular-devkit/build-angular": "^20.1.5",
        "@angular-eslint/builder": "20.1.1",
        "@angular-eslint/eslint-plugin": "20.1.1",
        "@angular-eslint/eslint-plugin-template": "^20.1.1",
        "@angular-eslint/schematics": "20.1.1",
        "@angular-eslint/template-parser": "20.1.1",
        "@angular/cli": "~20.1.5",
        "@angular/compiler-cli": "^20.1.6",
        "@isyfact/eslint-plugin": "4.0.0",
        "@ngneat/spectator": "^21.0.1",
        "@stylistic/eslint-plugin": "^5.2.3",
        "@types/jasmine": "~5.1.8",
        "@types/node": "^24.2.1",
        "@typescript-eslint/eslint-plugin": "^8.39.0",
        "@typescript-eslint/parser": "^8.39.0",
        "eslint": "^9.33.0",
        "eslint-plugin-editorconfig": "^4.0.3",
        "eslint-plugin-jsdoc": "^52.0.4",
        "jasmine-core": "~5.9.0",
        "karma": "^6.4.4",
        "ng-mocks": "^14.13.5",
        "ng-packagr": "^20.1.0",
        "prettier": "^3.6.2",
    }
}
```

#### Bibliothek (`package.json`)
```json
{
  "peerDependencies": {
    "@angular/common": "^20.1.6",
    "@angular/core": "^20.1.6",
    "primeng": "^20.0.1",
    "@primeuix/themes": "^1.2.3"
  },
}
```

---

### 5. CI/CD
- GitHub Actions Workflow aktualisiert:
  - `actions/checkout@v4` und `actions/setup-node@v4`
  - Node.js Version auf `20.x` angehoben

---

### 6. Codequalität geprüft
- **ESLint:** `npm run lint` → keine Fehler
- **Prettier:** `npm run prettier:check` → bestanden

---

### 7. Tests durchgeführt
- **Unit- & Integrationstests:** `npm run test` → alle Tests bestanden
- **Manuelle Tests:** 
  - UI geprüft
  - Hauptfunktionalitäten erfolgreich validiert
  - Keine kritischen Fehler festgestellt

---

## Zusammenfassung

### Breaking Changes:
- Flat Config-Format: Umstellung auf eslint.config.js, .eslintrc.js und .eslintrc.json nicht mehr unterstützt.
- inject(): Umstellung auf inject() in Angular, kann mit @angular-eslint/no-inject-in-constructor: 'off' deaktiviert werden.
- @primeng/themes → @primeuix/themes: Anpassungen an Imports, Styles und Konfiguration erforderlich.
- ngx-translate Update: API-Änderungen in Version 17, Migration Guide prüfen.
- Spectator Update: API-Änderungen in Version 21, Changelog prüfen.

### Weitere Änderungen:
- Migration auf Angular 20 & PrimeNG 20: Erfolgreich durchgeführt.
- Veraltete Komponenten ersetzt, neue Features integriert.
- GitHub Actions Workflow aktualisiert
- Abhängigkeiten, Tests & Qualitätssicherung auf aktuellem Stand: Alle aktualisiert.
- Alle Breaking Changes dokumentiert: Vollständige Dokumentation für Migration.

---

# Update Log - 09.05.2025

## Migration auf Angular v19 & PrimeNG v19

### 1. Aktualisierte Frameworks & Tools
- Angular: v18 → **v19.2.9**
- PrimeNG: v17 → **v19.1.2**
- Core-Pakete & CLI aktualisiert
- Migrationshinweise von [update.angular.io](https://update.angular.io) und [PrimeNG Migration Guide](https://primeng.org/migration/v19) umgesetzt

---

### 2. Änderungen in **_isy-angular-widgets_** (Bibliothek)

#### Paketkonfiguration (`index.ts`)
```ts
addPackageToPackageJson(tree, '@angular/common', '^19.2.9');
addPackageToPackageJson(tree, '@angular/core', '^19.2.9');
addPackageToPackageJson(tree, 'primeng', '^19.1.2');
addPackageToPackageJson(tree, '@primeng/themes', '^19.1.2');
```

#### Überarbeitete Dateien (Auswahl)
- Komponenten: `form-wrapper`, `hauptfenster`, `input-char`, `incomplete-date`, `multi-select-button`, `wizard`, `interactive-elements`
- Direktiven & Services: `input-char.directive`, `security-directive`, `security-guard`, `widgets-config.service`
- Tests: Alle zugehörigen .spec.ts-Dateien aktualisiert
- Übersetzungen: `de.json`, `en.json`
- **Gelöschte Module** (durch Umstieg auf Standalone): `hauptfenster.module.ts`, `wizard.module.ts`, `incomplete-date.module.ts`, `security.module.ts`

#### Neue Komponenten & Funktionen
- Neues IsyFact-Theme via `provideIsyFactTheme()`
- Alte Themes (`theme.css`, `FluentUI`) entfernt
- Neue Design-Variablen für das IsyFact-Styling
- `form-wrapper`: Unterstützung für Label-ID
- `skip-links`-Komponente zur barrierefreien Navigation
- `isy-wizard`: Neue Eigenschaft `allowFreeNavigation` für freie Schritt-Navigation
- Aktiver Zustand in der Links-Navigation farblich hervorgehoben
- Styling des `isy-input-char`-Dialogs überarbeitet
- Styling von schreibgeschützten Eingabefeldern angepasst  

---

### 3. Änderungen in **_isy-angular-widgets-demo_** (Demo-App)

#### Überarbeitete Dateien (Auswahl)
- Komponenten: `dashboard-*`, `isy-angular-components`, `objekt-*`, `primeng-*`
- Services: `date.service.ts`, `menu-translation.service.ts`, `page-title.service.ts`
- Übersetzungen: `de.json`, `en.json`
- Modulstruktur & Imports angepasst

---

### 4. PrimeNG-Komponenten ersetzt/aktualisiert

**Umbenannte Komponenten**

| Alt             | Neu               |
|-----------------|-------------------|
| `Calendar`      | `DatePicker`      |
| `Dropdown`      | `Select`          |
| `InputSwitch`   | `ToggleSwitch`    |
| `OverlayPanel`  | `Popover`         |
| `Sidebar`       | `Drawer`          |

**Ersetzte/veraltete Komponenten:**

| Alt              | Neu                                        |
|------------------|--------------------------------------------|
| `Chips`          | `AutoComplete` (multiple, ohne Typeahead)  |
| `TabMenu`        | `Tabs` (ohne Panels)                       |
| `Steps`          | `Stepper` (ohne Panels)                    |
| `InlineMessage`  | `Message`-Komponente                       |
| `TabView`        | `Tabs`-Komponenten                         |
| `Accordion`      | `AccordionPanel` + `Header` + `Content`    |
| `Messages`       | `Message`-Komponente                       |

---

### 5. Technische Anpassungen

#### Angular v19
- `TranslateModule.forChild()` für Lazy-Loaded Modules
- Konstante Werte mit readonly
- Migration auf standalone: true/false für Komponenten

#### PrimeNG v19
- Konfiguration jetzt via `providePrimeNG()` über `provideIsyFactTheme`
- `TriStateCheckbox` durch `p-checkbox` mit `indeterminate` ersetzt
- Checkbox-Label via `<label>` statt label-Property
- Chips `p-chips` ersetzt durch AutoComplete `p-autoComplete` (`multiple`, `typeahead=false`)
- `pInputTextarea` → `pTextarea`
- `severity="warning"` → `severity="warn"`
- `size` → `badgeSize`
- `Message` → `ToastMessageOptions` (wegen Namenskonflikt)

---

### 6. Aktualisierte Abhängigkeiten

#### Demo-App (`package.json`)
```json
{
    "dependencies": {
        "@angular/animations": "^19.2.9",
        "@angular/cdk": "^19.2.14",
        "@angular/common": "^19.2.9",
        "@angular/compiler": "^19.2.9",
        "@angular/core": "^19.2.9",
        "@angular/forms": "^19.2.9",
        "@angular/platform-browser": "^19.2.9",
        "@angular/platform-browser-dynamic": "^19.2.9",
        "@angular/router": "^19.2.9",
        "@ngx-translate/core": "^16.0.4",
        "@ngx-translate/http-loader": "^16.0.1",
        "@primeng/themes": "^19.1.2",
        "chart.js": "^4.4.9",
        "flag-icons": "^7.3.2",
        "primeflex": "^4.0.0",
        "primeng": "^19.1.2",
        "quill": "^2.0.3",
        "rxjs": "^7.8.2",
        "tslib": "^2.8.1",
        "zone.js": "~0.15.0"
    },
    "devDependencies": {
        "@angular-devkit/build-angular": "^19.2.10",
        "@angular-eslint/builder": "19.3.0",
        "@angular-eslint/eslint-plugin": "19.3.0",
        "@angular-eslint/eslint-plugin-template": "^19.3.0",
        "@angular-eslint/schematics": "19.3.0",
        "@angular-eslint/template-parser": "19.3.0",
        "@angular/cli": "~19.2.10",
        "@angular/compiler-cli": "^19.2.9",
        "@compodoc/compodoc": "^1.1.26",
        "@isyfact/eslint-plugin": "3.0.1",
        "@ngneat/spectator": "^19.5.0",
        "@stylistic/eslint-plugin-ts": "^3.1.0",
        "@types/jasmine": "~5.1.8",
        "@types/node": "^18.19.96",
        "@typescript-eslint/eslint-plugin": "^8.32.0",
        "@typescript-eslint/parser": "^8.32.0",
        "eslint": "^9.26.0",
        "eslint-plugin-jsdoc": "^50.6.11",
        "jasmine-core": "~5.7.1",
        "ng-mocks": "^14.13.4",
        "ng-packagr": "^19.2.2",
        "prettier": "^3.5.3",
        "typescript": "~5.8.3"
    }
}
```

#### Bibliothek (`package.json`)
```json
{
  "peerDependencies": {
    "@angular/common": "^19.2.9",
    "@angular/core": "^19.2.9",
    "primeflex": "^4.0.0",
    "primeng": "^19.1.2",
    "@primeng/themes": "^19.1.2"
  },
  "dependencies": {
    "tslib": "^2.8.1"
  }
}
```
---

### 7. **Behandelte GitHub-Issues**

| ID    | Titel                                                                     |
|-------|---------------------------------------------------------------------------|
| #254  | Missing option in p-steps for jumping between steps                       |
| #249  | P-Multiselect loses focus by using keyboard                               |
| #247  | Style of readonly Inputs                                                  |
| #241  | Charpicker loses Focus                                                    |
| #239  | Provide a skip link in isy-hauptfenster                                   |
| #238  | Allow Form Field Wrapper label id to be specified                         |
| #237  | multi-select-button.component.scss overrides global styles of p-accordion |

---

### 8. Codequalität geprüft
- **ESLint:** `npm run lint` → keine Fehler
- **Prettier:** `npm run prettier:check` → bestanden

---

### 9. Tests durchgeführt
- **Unit- & Integrationstests:** `npm run test` → alle Tests bestanden
- **Manuelle Tests:** 
  - UI geprüft
  - Hauptfunktionalitäten erfolgreich validiert
  - Keine kritischen Fehler festgestellt

---

### **Breaking Changes**

#### Angular v19
- Module entfernt (→ Umstellung auf standalone)
- Lazy-Loaded Translations benötigen `TranslateModule.forChild()`
- `readonly` für konstante Variablen empfohlen

#### PrimeNG v19
- Diverse Komponenten ersetzt (siehe oben)
- API-Änderungen: Properties & Komponentenverhalten angepasst
- Konfiguration über `provideIsyFactTheme()` statt `PrimeNGConfig`

#### isy-angular-widgets v19
- **Validierungsfehler-Objekte umbenannt** (vorher als TODO markiert):

| Alt                       | Neu                             |
|---------------------------|---------------------------------|
| FUTURE                    | INVALIDFUTUREDATE               |
| PAST                      | INVALIDPASTDATE                 |
| UNSPECIFIEDDATE           | INVALIDUNSPECIFIEDDATE          |
| UNSPECIFIEDISODATE        | INVALIDUNSPECIFIEDISODATE       |
| CREDITCARDEXPIRATIONDATE  | INVALIDCREDITCARDEXPIRATIONDATE |
| CREDITCARD                | INVALIDCREDITCARDNUMBER         |
| DATE                      | INVALIDISODATE                  |
| TIME                      | INVALIDISOTIME                  |
| DATETIME                  | INVALIDISODATETIME              |

- **@deprecated:**
  - Der Output `stepperIndexChange` wurde in `indexChange` umbenannt und in der Demo-Anwendung angepasst.

---

## Zusammenfassung
- Migration auf Angular 19 & PrimeNG 19 erfolgreich durchgeführt
- Veraltete Komponenten ersetzt, neue Features integriert
- Theming modernisiert & Standalone-Ansatz umgesetzt
- Abhängigkeiten, Tests & Qualitätssicherung auf aktuellem Stand
- Alle Breaking Changes dokumentiert

---

# Update Log - 03.09.2024

## Update von Angular v17 auf v18

### Aktualisierungsschritte

1. **Aktualisierung der Angular CLI und Core-Pakete**

2. **Überprüfung der Migrationshinweise auf https://update.angular.io/**

3. **Code-Anpassungen in der _isy-angular-widgets_ Bibliothek:**

    Anpassungen in `index.ts` vorgenommen:
    ```typescript
    addPackageToPackageJson(tree, '@angular/common', '^18.1.4');
    addPackageToPackageJson(tree, '@angular/core', '^18.1.4');
    addPackageToPackageJson(tree, 'primeicons', '^7.0.0');
    addPackageToPackageJson(tree, 'primeng', '^17.18.8');
    addPackageToPackageJson(tree, 'moment', '^2.30.1');
    ```

    Anpassungen vorgenommen in:
    - `correlation-id-http-interceptor.spec.ts`
    - `zipkin-open-tracing-http-interceptor.spec.ts`
    - `wizard.component.spec.ts`

    Veraltete Module:
    - `HttpClientModule` durch `provideHttpClient()` ersetzt
    - `HttpClientTestingModule` durch `provideHttpClientTesting()` ersetzt
    - `RouterTestingModule`  durch `provideRouter()` ersetzt

4. **Code-Anpassungen in der _isy-angular-widgets-demo_ (Demo-Anwendung):**

    Anpassungen vorgenommen in:
    - `app.module.ts`
    - `objekt-suchen.component.spec.ts`
    - `objekt-anzeigen.component.spec.ts`

    Veraltete Module:
    - `HttpClientModule` durch `provideHttpClient()` ersetzt
    - `RouterTestingModule`  durch `provideRouter()` ersetzt

    Anpassung in der `tsconfig.json` vorgenommen:
    Der Eintrag `resolveJsonModule` wurde hinzugefügt und aktiviert, um den Import von Modulen mit der Erweiterung `.json` zu ermöglichen, da TypeScript standardmäßig keine JSON-Dateien auflöst. Die Datei `sonderzeichenliste.json` wird in den folgenden Dateien verwendet:
    - `character.service.ts`
    - `multi-select-button.component.spec.ts`
    - `input-char-preview.component.spec.ts`
    - `input-char-dialog.component.spec.ts`

5. **Abhängigkeiten aktualisiert:**
    - `package.json` überprüft und folgende Abhängigkeiten aktualisiert:
        ```json
        {
            "dependencies": {
                "@angular/animations": "^18.1.4",
                "@angular/cdk": "^18.1.4",
                "@angular/common": "^18.1.4",
                "@angular/compiler": "^18.1.4",
                "@angular/core": "^18.1.4",
                "@angular/forms": "^18.1.4",
                "@angular/platform-browser": "^18.1.4",
                "@angular/platform-browser-dynamic": "^18.1.4",
                "@angular/router": "^18.1.4",
                "chart.js": "^4.4.3",
                "flag-icons": "^7.2.3",
                "primeicons": "^7.0.0",
                "primeng": "^17.18.8",
                "tslib": "^2.6.3",
                "zone.js": "~0.14.10"
            },
            "devDependencies": {
                "@angular-devkit/build-angular": "^18.1.4",
                "@angular-eslint/builder": "18.2.0",
                "@angular-eslint/eslint-plugin": "18.2.0",
                "@angular-eslint/eslint-plugin-template": "^18.2.0",
                "@angular-eslint/schematics": "18.2.0",
                "@angular-eslint/template-parser": "18.2.0",
                "@angular/cli": "~18.1.4",
                "@angular/compiler-cli": "^18.1.4",
                "@compodoc/compodoc": "^1.1.25",
                "@isyfact/eslint-plugin": "2.0.0",
                "@ngneat/spectator": "^19.0.0",
                "@stylistic/eslint-plugin-ts": "^2.6.2",
                "@types/node": "^22.2.0",
                "@typescript-eslint/eslint-plugin": "^8.0.1",
                "@typescript-eslint/parser": "^8.0.1",
                "eslint": "^9.9.0",
                "eslint-plugin-jsdoc": "^50.0.1",
                "jasmine-core": "~5.2.0",
                "karma": "^6.4.4",
                "moment": "^2.30.1",
                "ng-mocks": "^14.13.0",
                "ng-packagr": "^18.1.0",
                "prettier": "^3.3.3",
                "typescript": "~5.5.4"
            }
        }
        ```

    - `package.json` in der _isy-angular-widgets_ Bibliothek überprüft und folgende Abhängigkeiten aktualisiert:
        ```json
        {
            "peerDependencies": {
            "@angular/common": "^18.1.4",
            "@angular/core": "^18.1.4",
            "moment": "^2.30.1",
            "primeicons": "^7.0.0",
            "primeng": "^17.18.8"
            },
            "dependencies": {
            "tslib": "^2.6.3"
            }
        }
        ```
6. **ESlint- und Prettier-Überprüfung durchgeführt:**
    - **ESlint:** Mit `npm run lint` ausgeführt.
    - **Prettier:** Mit `npm run prettier:check` ausgeführt.

7. **Tests durchgeführt:**
    - **Unit- und Integrations-Tests:** Mit `npm run test` ausgeführt, um sicherzustellen, dass alle Tests bestehen.

8. **Manuelle Überprüfung:**
   - Manuelle Tests der Hauptfunktionalitäten der Anwendung durchgeführt.
   - Überprüfung der Benutzeroberfläche auf Darstellungsfehler.
   - Sicherstellung, dass alle kritischen Pfade in der Anwendung wie erwartet funktionieren.

### Zusammenfassung der Änderungen
   - Angular von Version v17 auf v18 aktualisiert.
   - Veraltete Module durch aktuelle ersetzt.
   - Abhängigkeiten in `package.json` aktualisiert.
   - ESlint- und Prettier-Überprüfung erfolgreich durchgeführt und bestanden.
   - Tests erfolgreich durchgeführt und bestanden.
