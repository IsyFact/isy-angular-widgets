# Migration von Version 20 auf Version 21

## Überblick

- Angular: v20 → **v21.1.4**
- PrimeNG: v20 → **v21.1.1**
- `@primeuix/themes`: **^2.0.3**
- Migrationshinweise von [update.angular.io](https://update.angular.io) und dem [PrimeNG Migration Guide](https://primeng.org/migration/v21) wurden umgesetzt.

## Breaking Changes

### PrimeNG: CSS-basierte Animationen

PrimeNG v21 verwendet CSS-basierte Animationen, da das Angular-Animations-Paket als deprecated markiert wurde.

**Auswirkung:** `showTransitionOptions` und `hideTransitionOptions` sind deprecated und haben keine Wirkung mehr. Die Properties existieren weiterhin, werden jedoch ignoriert.

**Migration:** `provideAnimations()` aus der `app.config.ts` entfernen.

### Moment.js aus der Bibliothek entfernt

Moment.js wird weder in der Bibliothek noch in deren Unit-Tests verwendet. Die Datumsvalidierung basiert jetzt auf nativer `Date`-Logik.

**Auswirkung:** **Moment.js ist keine (Peer-)Abhängigkeit mehr.** Consumer können weiterhin Moment-Objekte übergeben, sofern `toDate()` verfügbar ist (Backward Compatibility).

**Migration:** Empfohlen wird die Übergabe von `Date`-Objekten oder ISO-Strings.

Unterstützte Eingabeformate der Validatoren:

- `isInFuture` / `isInPast` akzeptieren:
  - `Date`
  - ISO-Date-Only (`YYYY-MM-DD`)
  - ISO-DateTime mit `Z` oder Offset (z. B. `2099-12-31T00:00:00+01:00`)
  - `DD.MM.YYYY`
  - `DD-MM-YYYY` (primär als `DD-MM-YYYY` interpretiert, optionaler Fallback `MM-DD-YYYY`)
  - `number` (Timestamp)
  - Moment-ähnliche Objekte mit `toDate()`
- `dateFormat(...)` unterstützt die in der Bibliothek verwendeten Formate (u. a. `YYYY-MM-DD`, `DD.MM.YYYY`, `HH:mm:ss`, `YYYY-MM-DDTHH:mm:ss[Z]`, `MM/YY`) sowie `Date` und Moment-ähnliche Objekte via `toDate()`.

> **Wichtig:** `isoDateTime` bleibt strikt und akzeptiert ausschließlich `YYYY-MM-DDTHH:mm:ssZ` mit literalem `Z` am Ende (UTC). Offsets wie `+01:00` sind ungültig.

### `form-wrapper`: Priorisierung der Fehlermeldungen

Die Priorisierung von Fehlermeldungen erfolgt nun über die Reihenfolge der `validationMessages`-Keys statt über die zuvor implizite Reihenfolge aus `control.errors`. Zusätzlich ist `validationMessages` **nicht mehr optional**.

**Auswirkung:** Bei mehreren gleichzeitig verletzten Validatoren kann sich die angezeigte Fehlermeldung ändern. Die Fehlertextgröße wurde reduziert.

**Migration:** `validationMessages` in der gewünschten Priorisierungsreihenfolge definieren und explizit setzen.

### Tests: `ng-mocks` ist unter Angular 21 nicht mehr kompatibel

Die Tests der Bibliothek wurden von `ng-mocks` / `MockComponents(...)` auf eigene Standalone-Stubs und `overrideComponent(...)` umgestellt. Zusätzlich wurde `provideZoneChangeDetection()` im Test-Modul ergänzt und die Test-Plattform modernisiert.

**Auswirkung:** Eigene Testsuiten, die auf `ng-mocks` basieren, laufen unter Angular 21 nicht mehr. Timing- und Async-Verhalten in Tests kann sich ändern.

**Migration:** `ng-mocks` durch Standalone-Stubs und `overrideComponent(...)` ersetzen; bei Bedarf `provideZoneChangeDetection()` ergänzen.

## Deprecations

- **ngx-translate:** `TranslateService.currentLang` ist deprecated – stattdessen `getCurrentLang()` verwenden.
- **Angular Tests:** `BrowserDynamicTestingModule` / `platformBrowserDynamicTesting()` sind deprecated – stattdessen `BrowserTestingModule` und `platformBrowserTesting()` verwenden.

## `isy-wizard`: Button-Anordnung und optionaler Footer (seit 21.1.0)

Der `isy-wizard` unterstützt optional einen projektspezifischen Footer über ein projiziertes Template. Der Standard-Footer bleibt als Fallback erhalten. Die Standard-Anordnung der Buttons wurde überarbeitet, damit Aktionen konsistent platziert werden.

**Auswirkung:** Bestehende Anwendungen ohne Custom-Footer bleiben lauffähig. Wurde bisher implizit von der alten Reihenfolge oder Sichtbarkeit einzelner Aktionen ausgegangen, ist eine Anpassung erforderlich.

**Migration:**

- Reicht die Standard-Anordnung aus, ist keine technische Migration nötig – die geänderte Anordnung sollte jedoch fachlich und visuell geprüft werden.
- Werden eine abweichende Reihenfolge, andere Beschriftungen oder projektspezifisches Styling benötigt, den Footer des `isy-wizard` explizit per Template definieren.

## Aktualisierte Abhängigkeiten

```json
{
  "peerDependencies": {
    "@angular/common": "^21.1.4",
    "@angular/core": "^21.1.4",
    "primeflex": "^4.0.0",
    "primeicons": "^7.0.0",
    "primeng": "^21.1.3",
    "@primeuix/themes": "^2.0.3"
  }
}
```

Die `ng-add`-Schematik trägt dieselben Versionen in die `package.json` des Zielprojekts ein.

---

# Migration von Version 19 auf Version 20

## Überblick

- Angular: v19 → **v20.1.1**
- PrimeNG: v19 → **v20.0.0**
- Migrationshinweise von [update.angular.io](https://update.angular.io) und dem [PrimeNG Migration Guide](https://primeng.org/migration/v20) wurden umgesetzt.

## Breaking Changes

### ESLint: Umstellung auf das Flat-Config-Format

Das `@isyfact/eslint-plugin` nutzt nun das Flat-Config-Format.

**Auswirkung:** `.eslintrc.js` und `.eslintrc.json` werden nicht mehr unterstützt.

**Migration:** Die Konfiguration auf `eslint.config.js` umstellen – siehe [ESLint Migration Guide](https://eslint.style/guide/migration).

### Umstellung auf `inject()`

Angular führt `inject()` anstelle der klassischen Constructor-Injection ein.

**Auswirkung:** Anpassungen an bestehenden Komponenten oder Services können erforderlich sein.

**Migration:** Auf [`inject()`](https://angular.dev/reference/migrations/inject-function) umstellen. Ist das nicht gewünscht, lässt sich die Regel über `@angular-eslint/no-inject-in-constructor: 'off'` in der ESLint-Konfiguration deaktivieren.

### `@primeng/themes` ersetzt durch `@primeuix/themes`

**Auswirkung:** Paketname, API, Struktur und Build-Konfiguration ändern sich. Anpassungen an Imports, Styles und Konfigurationen sind erforderlich; möglicherweise müssen weitere Abhängigkeiten aktualisiert werden.

**Migration:** Imports und Konfigurationen auf `@primeuix/themes` umstellen.

### Upgrade von ngx-translate v16 auf v17

**Auswirkung:** Das Upgrade kann API-Änderungen und neue Konfigurationen enthalten.

**Migration:** Details im [ngx-translate Migration Guide](https://ngx-translate.org/getting-started/migration-guide/) prüfen.

### Upgrade von Spectator v19.6.2 auf v21.0.1

**Auswirkung:** Betrifft ausschließlich Testcode; das Upgrade kann API-Änderungen enthalten.

**Migration:** Details im [Spectator Changelog](https://github.com/ngneat-archive/spectator/blob/master/CHANGELOG.md) prüfen. Das ursprüngliche Repository `ngneat/spectator` ist nicht mehr verfügbar; der Changelog liegt im Archiv der Organisation.

## Aktualisierte Abhängigkeiten

```json
{
  "peerDependencies": {
    "@angular/common": "^20.1.6",
    "@angular/core": "^20.1.6",
    "primeng": "^20.0.1",
    "@primeuix/themes": "^1.2.3"
  }
}
```

Die `ng-add`-Schematik trägt entsprechend `@angular/common@^20.1.6`, `@angular/core@^20.1.6`, `primeng@^20.0.1` und `@primeuix/themes@^1.2.3` ein.

## CI/CD

- GitHub-Actions-Workflow auf `actions/checkout@v4` und `actions/setup-node@v4` aktualisiert.
- Node.js-Version auf `20.x` angehoben.

---

# Migration von Version 18 auf Version 19

## Überblick

- Angular: v18 → **v19.2.9**
- PrimeNG: v17 → **v19.1.2**
- Migrationshinweise von [update.angular.io](https://update.angular.io) und dem [PrimeNG Migration Guide](https://primeng.org/migration/v19) wurden umgesetzt.

## Breaking Changes

### Theming: FluentUI ersetzt durch das PrimeNG-Theming mit Standard-Theme *Nora*

Das FluentUI-Theme wurde entfernt. Das neue IsyFact-Theme wird über `provideIsyFactTheme()` bereitgestellt, die PrimeNG-Konfiguration erfolgt über `providePrimeNG()` statt über `PrimeNGConfig`.

**Auswirkung:** Die alten Themes (`theme.css`, FluentUI) stehen nicht mehr zur Verfügung. Es gelten neue Design-Variablen für das IsyFact-Styling. Der Dark Mode des Standard-Themes wurde mit 19.0.1 deaktiviert.

**Migration:** Theme-Einbindung auf `provideIsyFactTheme()` umstellen und eigene Style-Overrides gegen die neuen Design-Variablen prüfen.

### Umbenennung der Validierungsfehler-Objekte

| Alt                        | Neu                               |
|----------------------------|-----------------------------------|
| `FUTURE`                   | `INVALIDFUTUREDATE`               |
| `PAST`                     | `INVALIDPASTDATE`                 |
| `UNSPECIFIEDDATE`          | `INVALIDUNSPECIFIEDDATE`          |
| `UNSPECIFIEDISODATE`       | `INVALIDUNSPECIFIEDISODATE`       |
| `CREDITCARDEXPIRATIONDATE` | `INVALIDCREDITCARDEXPIRATIONDATE` |
| `CREDITCARD`               | `INVALIDCREDITCARDNUMBER`         |
| `DATE`                     | `INVALIDISODATE`                  |
| `TIME`                     | `INVALIDISOTIME`                  |
| `DATETIME`                 | `INVALIDISODATETIME`              |

**Auswirkung:** Anwendungen, die Fehler-Keys direkt auswerten (z. B. in `validationMessages` oder eigenen Fehlerausgaben), müssen angepasst werden.

**Migration:** Alle Verwendungen der alten Keys auf die neuen Namen umstellen.

### Umstellung auf Standalone-Komponenten

Die NgModules der Bibliothek wurden entfernt: `hauptfenster.module.ts`, `wizard.module.ts`, `incomplete-date.module.ts`, `security.module.ts`.

**Auswirkung:** Imports über diese Module funktionieren nicht mehr.

**Migration:**

- Die Komponenten direkt als Standalone-Komponenten importieren.
- Lazy-Loaded Übersetzungen benötigen `TranslateModule.forChild()`.
- Für konstante Werte wird `readonly` empfohlen.

### PrimeNG: umbenannte und ersetzte Komponenten

Umbenannte Komponenten:

| Alt            | Neu            |
|----------------|----------------|
| `Calendar`     | `DatePicker`   |
| `Dropdown`     | `Select`       |
| `InputSwitch`  | `ToggleSwitch` |
| `OverlayPanel` | `Popover`      |
| `Sidebar`      | `Drawer`       |

Ersetzte bzw. veraltete Komponenten:

| Alt             | Neu                                       |
|-----------------|-------------------------------------------|
| `Chips`         | `AutoComplete` (`multiple`, ohne Typeahead) |
| `TabMenu`       | `Tabs` (ohne Panels)                      |
| `Steps`         | `Stepper` (ohne Panels)                   |
| `InlineMessage` | `Message`                                 |
| `TabView`       | `Tabs`                                    |
| `Accordion`     | `AccordionPanel` + `Header` + `Content`   |
| `Messages`      | `Message`                                 |

Weitere API-Änderungen in PrimeNG v19:

- `TriStateCheckbox` → `p-checkbox` mit `indeterminate`
- Checkbox-Label über `<label>` statt über das `label`-Property
- `pInputTextarea` → `pTextarea`
- `severity="warning"` → `severity="warn"`
- `size` → `badgeSize`
- `Message` → `ToastMessageOptions` (wegen Namenskonflikt)

## Deprecations

- Der Output `stepperIndexChange` des `isy-wizard` wurde in `indexChange` umbenannt; `stepperIndexChange` ist deprecated.

## Neue Funktionen

- `skip-links`-Komponente zur barrierefreien Navigation
- `isy-wizard`: neue Eigenschaft `allowFreeNavigation` für freie Schritt-Navigation
- `form-wrapper`: Unterstützung für eine Label-ID
- Aktiver Zustand in der Linksnavigation farblich hervorgehoben
- Überarbeitetes Styling des `isy-input-char`-Dialogs sowie schreibgeschützter Eingabefelder

## Aktualisierte Abhängigkeiten

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

# Migration von Version 17 auf Version 18

## Überblick

- Angular: v17 → **v18.1.4**
- PrimeNG bleibt auf **^17.18.8**, `primeicons` wird auf **^7.0.0** angehoben.
- Migrationshinweise von [update.angular.io](https://update.angular.io) wurden umgesetzt.

## Breaking Changes

### Veraltete Angular-Module ersetzt

| Alt                        | Neu                          |
|----------------------------|------------------------------|
| `HttpClientModule`         | `provideHttpClient()`        |
| `HttpClientTestingModule`  | `provideHttpClientTesting()` |
| `RouterTestingModule`      | `provideRouter()`            |

**Migration:** Die entsprechenden Module in Anwendungs- und Testkonfigurationen durch die Provider-Funktionen ersetzen.

### `resolveJsonModule` erforderlich

In der `tsconfig.json` muss `resolveJsonModule` aktiviert sein, damit Module mit der Endung `.json` importiert werden können. TypeScript löst JSON-Dateien standardmäßig nicht auf; die Bibliothek verwendet `sonderzeichenliste.json` unter anderem in `character.service.ts`.

**Migration:** `"resolveJsonModule": true` in der `tsconfig.json` ergänzen.

## Aktualisierte Abhängigkeiten

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

---

# Migration von Version 16 auf Version 17

## Breaking Changes

- Upgrade von Angular und PrimeNG auf Version 17. Es sind die Migrationshinweise von [update.angular.io](https://update.angular.io) und dem [PrimeNG Migration Guide](https://primeng.org/migration/v17) zu beachten.

---

# Migration von Version 15 auf Version 16

## Breaking Changes

- Upgrade von Angular und PrimeNG auf Version 16.
- `WidgetsConfigService#getTranslation` erlaubt jetzt auch Werte vom Typ `undefined`.

**Auswirkung:** Eigene Implementierungen bzw. Aufrufer müssen `undefined` als möglichen Rückgabewert behandeln.

---

# Migration von Version 14 auf Version 15

## Breaking Changes

### Angular Router: entfernte Guard-APIs

- Die Implementierung der Interfaces `CanActivate` und `CanLoad` wurde entfernt, da sie deprecated sind.
- Der Parameter `state` wurde aus der Signatur der Auth-Guard-Methode `canActivate` entfernt.
- Die Auth-Guard-Methode `canLoad` wurde entfernt, da das `CanLoad`-Interface deprecated ist.

**Migration:** Auf funktionale Guards umstellen und Aufrufe ohne den `state`-Parameter anpassen. Für `canLoad` stattdessen `canMatch` verwenden.

### CharPicker-API an `p-dialog` angeglichen

Die Properties der Komponente `input-char` wurden an die API von `p-dialog` angeglichen.

**Migration:** Bindings an den CharPicker gegen die neuen Property-Namen prüfen.

---

# Migration von Version 0.8 auf Version 14

## Breaking Changes

Die Properties der `HauptfensterComponent` zur Konfiguration der Seitenleistenbreite wurden ersetzt:

| Alt                       | Neu                        |
|---------------------------|----------------------------|
| `linksNavigationCols`     | `linksNavigationWidth`     |
| `informationsbereichCols` | `informationsbereichWidth` |

**Auswirkung:** Statt einer Spaltenanzahl wird nun eine freie Breitenangabe erwartet (Standard: `15em`).

**Migration:** Bindings umbenennen und die Werte von Spaltenanzahlen auf CSS-Breitenangaben umstellen.

---

# Migration von Version 0.7 auf Version 0.8

## Breaking Changes

Das Security-Paket wurde von `/core/security` nach `/security` verschoben.

**Migration:** Imports auf den neuen Pfad anpassen.
