# Update Log - 27.03.2025

## Migration von Angular v18 auf v19 und PrimeNG v17 auf v19

### 1. Aktualisierte Frameworks & Tools
- Angular: v18 → **v19.2.4**
- PrimeNG: v17 → **v19.0.10**
- Alle Core-Pakete & CLI aktualisiert
- Migrationshinweise von [update.angular.io](https://update.angular.io) & [PrimeNG Migration Guide](https://primeng.org/guides/migration) angewendet

---

### 2. Änderungen in **_isy-angular-widgets_** (Bibliothek)

#### Paketkonfiguration (`index.ts`)
```ts
addPackageToPackageJson(tree, '@angular/common', '19.2.4');
addPackageToPackageJson(tree, '@angular/core', '19.2.4');
addPackageToPackageJson(tree, 'primeng', '19.0.10');
addPackageToPackageJson(tree, 'moment', '^2.30.1');
addPackageToPackageJson(tree, '@primeng/themes', '19.0.10');
```

#### Angepasste Komponenten, Services & Direktiven
- `package.json`
- `hauptfenster.component.html`
- `hauptfenster.component.spec.ts`
- `hauptfenster.component.ts`
- `widgets-config.service.ts`
- `incomplete-date.component.spec.ts`
- `incomplete-date.component.ts`
- `incomplete-date.module.ts`
- `input-char-dialog.component.spec.ts`
- `input-char-dialog.component.ts`
- `input-char.component.spec.ts`
- `input-char.component.ts`
- `multi-select-button.component.html`
- `multi-select-button.component.scss`
- `multi-select-button.component.spec.ts`
- `multi-select-button.component.ts`
- `input-char.directive.spec.ts`
- `input-char.directive.ts`
- `security-directive.ts`
- `security-guard.ts`
- `seitentoolbar.component.ts`
- `interactive-elements.component.html`
- `interactive-elements.component.spec.ts`
- `interactive-elements.component.ts`
- `wizard.component.spec.ts`
- `wizard.component.ts`
- `wizard.directive.ts`
- `public-api.ts`
- **Module gelöscht** (wegen Umstellung auf Standalone):
    - `hauptfenster.module.ts`
    - `incomplete-date.module.ts`
    - `security.module.ts`
    - `wizard.module.ts`

#### Neue Funktion
- `provideIsyFactTheme()` zur Bereitstellung des IsyFact-Themes
- PrimeNG `theme.css` und das FluentUI-Theme wurden entfernt

---

### 3. Änderungen in **_isy-angular-widgets-demo_** (Demo-App)

#### Module, Komponenten & Services
- `app.module.ts`
- `chart.component.ts`
- `dashboard-informationsbereich.component.spec.ts`
- `dashboard-informationsbereich.component.ts`
- `dashboard-linksnavigation.component.spec.ts`
- `dashboard-linksnavigation.component.ts`
- `dashboard-widget.component.spec.ts`
- `dashboard-widget.component.ts`
- `dashboard.component.ts`
- `isy-angular-components.component.ts`
- `dialog-sachverhalte-bearbeiten.component.spec.ts`
- `objekt-anzeigen.component.html`
- `objekt-anzeigen.component.spec.ts`
- `objekt-anzeigen.module.ts`
- `objekt-suchen.component.spec.ts`
- `objekt-suchen.component.ts`
- `objekt-suchen.module.ts`
- `date.service.ts`
- `primeng-form.component.html`
- `primeng-menu.component.html`
- `primeng-messages.component.html`
- `primeng-misc.component.html`
- `primeng-overlay.component.html`
- `primeng-overlay.component.spec.ts`
- `primeng-panel.component.html`
- `file-option.ts`
- `primeng-widgets.module.ts`
- `menu-translation.service.ts`
- `page-title.service.ts`

---

### 4. PrimeNG-Komponenten aktualisiert & ersetzt
| Alte Komponente | Neue Komponente   |
|-----------------|-------------------|
| `Calendar`      | `DatePicker`      |
| `Dropdown`      | `Select`          |
| `InputSwitch`   | `ToggleSwitch`    |
| `OverlayPanel`  | `Popover`         |
| `Sidebar`       | `Drawer`          |

**Ersetzte/veraltete Komponenten:**

| Alt             | Neu                                                  |
|------------------|-------------------------------------------------------|
| `Chips`          | `AutoComplete` (multiple, ohne Typeahead)            |
| `TabMenu`        | `Tabs` (ohne Panels)                                 |
| `Steps`          | `Stepper` (ohne Panels)                              |
| `InlineMessage`  | `Message`-Komponente                                 |
| `TabView`        | `Tabs`-Komponenten                              |
| `Accordion`      | `AccordionPanel` + `Header` + `Content`              |
| `Messages`       | `Message`-Komponente                                 |

---

### 5. Technische Anpassungen in der Bibliothek und Demo-App

#### Angular v19
- `TranslateModule.forChild()` für Lazy-Loaded Module
- Verwendung von `readonly` bei konstanten Werten
- `standalone: false` bei klassischen Komponenten

#### PrimeNG v19
- `PrimeNGConfig` ersetzt durch `providePrimeNG()` via `provideIsyFactTheme`
- `TriStateCheckbox` ersetzt durch `p-checkbox` mit `indeterminate`
- Checkbox `label`-Property entfernt → stattdessen `<label>`
- Chips `p-chips` ersetzt durch AutoComplete `p-autoComplete` (`multiple`, `typeahead=false`)
- `pInputTextarea` → `pTextarea`
- Badge Property `size` → `badgeSize`
- Tag Property `severity="warning"` → `severity="warn"`
- `Message` in primeng/api → `ToastMessageOptions`

---

### 6. Aktualisierte Abhängigkeiten (`package.json`)

#### Demo-App:
```json
{
    "dependencies": {
        "@angular/animations": "19.2.4",
        "@angular/cdk": "19.2.4",
        "@angular/common": "19.2.4",
        "@angular/compiler": "19.2.4",
        "@angular/core": "19.2.4",
        "@angular/forms": "19.2.4",
        "@angular/platform-browser": "19.2.4",
        "@angular/platform-browser-dynamic": "19.2.4",
        "@angular/router": "19.2.4",
        "@ngx-translate/core": "^16.0.4",
        "@ngx-translate/http-loader": "^16.0.1",
        "@primeng/themes": "19.0.10",
        "chart.js": "^4.4.8",
        "flag-icons": "^7.3.2",
        "primeng": "19.0.10",
        "quill": "^2.0.3",
        "rxjs": "7.8.2",
        "tslib": "^2.8.1",
        "zone.js": "0.15.0"
    },
    "devDependencies": {
        "@angular-devkit/build-angular": "^19.2.4",
        "@angular-eslint/builder": "19.3.0",
        "@angular-eslint/eslint-plugin": "19.3.0",
        "@angular-eslint/eslint-plugin-template": "19.3.0",
        "@angular-eslint/schematics": "19.3.0",
        "@angular-eslint/template-parser": "19.3.0",
        "@angular/cli": "19.2.4",
        "@angular/compiler-cli": "19.2.4",
        "@compodoc/compodoc": "^1.1.26",
        "@ngneat/spectator": "^19.4.1",
        "@types/jasmine": "~5.1.7",
        "@types/node": "^22.13.14",
        "@typescript-eslint/eslint-plugin": "^8.28.0",
        "@typescript-eslint/parser": "^8.28.0",
        "eslint": "^9.23.0",
        "eslint-plugin-jsdoc": "^50.6.9",
        "jasmine-core": "~5.6.0",
        "ng-mocks": "^14.13.4",
        "ng-packagr": "19.2.0",
        "prettier": "^3.5.3",
        "typescript": "5.8.2"
    }
}
```

#### Bibliothek:
```json
{
  "peerDependencies": {
    "@angular/common": "19.2.4",
    "@angular/core": "19.2.4",
    "primeflex": "^4.0.0",
    "primeng": "19.0.10",
    "@primeng/themes": "19.0.10"
  },
  "dependencies": {
    "tslib": "^2.8.1"
  }
}
```
---

### 7. Codequalität geprüft
- **ESLint:** `npm run lint` → keine Fehler
- **Prettier:** `npm run prettier:check` → bestanden

---

### 8. Tests durchgeführt
- **Unit- & Integrationstests:** `npm run test` → alle Tests bestanden
- **Manuelle Tests:** 
  - UI geprüft
  - Hauptfunktionalitäten erfolgreich validiert
  - Keine kritischen Fehler festgestellt

---

### **Breaking Changes**

#### Angular v19

- **Standalone-Komponenten erforderlich:**  
  Mehrere Module (`hauptfenster.module.ts`, `wizard.module.ts`,`incomplete-date.module.ts` und `security.module.ts`) wurden entfernt. Komponenten wurden auf **Standalone-Komponenten** umgestellt.
  → Beim Nachrüsten: `standalone: true` oder `standalone: false` explizit setzen.

- **Lazy Loading mit `TranslateModule.forChild()`:**  
  Übersetzungen in Lazy-Loaded Modulen müssen mit `TranslateModule.forChild()` geladen werden, sonst keine Funktionalität.

- **Readonly-Pflicht bei Konstanten:**  
  Best Practices von Angular 19 verlangen `readonly` bei unveränderlichen Variablen – kann zu Typfehlern führen.

---

#### PrimeNG v19

- **Ersetzte Komponenten (nicht mehr verfügbar):**

  | Alt               | Neu                  |
  |--------------------|----------------------|
  | `Calendar`         | `DatePicker`         |
  | `Dropdown`         | `Select`             |
  | `InputSwitch`      | `ToggleSwitch`       |
  | `OverlayPanel`     | `Popover`            |
  | `Sidebar`          | `Drawer`             |
  | `Chips`            | `AutoComplete`       |
  | `TabMenu`          | `Tabs`               |
  | `Steps`            | `Stepper`            |
  | `Messages`, `InlineMessage` | `Message` |
  | `TabView`          | `Tabs`-Komponente |
  | `Accordion`        | `AccordionPanel` + `Header` + `Content` |

- **API-Änderungen an bestehenden Komponenten:**
  - `TriStateCheckbox` entfernt → durch `p-checkbox` mit `indeterminate` ersetzen
  - Checkbox `label`-Property bei `p-checkbox` entfernt → stattdessen `<label>` um das Element verwenden
  - `pInputTextarea` ersetzt durch `pTextarea`
  - Tag Property `severity="warning"` ersetzt durch `severity="warn"`
  - Badge Property `size` ersetzt durch `badgeSize`
  - Chips `p-chips` → ersetzt durch AutoComplete `p-autoComplete` mit `multiple` und `typeahead=false`
  - Die Schnittstelle `Message` in primeng/api wurde in `ToastMessageOptions` umbenannt, aufgrund eines Namenskonflikts mit der Message-Komponente.

- **Konfigurationsthema:**
  - `PrimeNGConfig` wird nicht mehr direkt konfiguriert  
    → ersetzt durch `providePrimeNG()` via `provideIsyFactTheme()`

---

## Zusammenfassung

- Angular v19 & PrimeNG v19 erfolgreich migriert  
- Veraltete Komponenten & Module ersetzt  
- Abhängigkeiten aktualisiert  
- Tests & manuelle Checks bestanden  
- Codequalität mit ESLint & Prettier sichergestellt

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
