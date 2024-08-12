# Update Log

## Update von Angular v17 auf v18 - 08.08.2024

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
    addPackageToPackageJson(tree, 'primeflex', '^3.3.1');
    addPackageToPackageJson(tree, 'moment', '^2.30.1');
    ```

    Anpassungen vorgenommen in:
    - `correlation-id-http-interceptor.spec.ts`
    - `zipkin-open-tracing-http-interceptor.spec.ts`
    - `wizard.component.spec.ts`

    Veraltete Module ersetzt:
    - `HttpClientModule` durch `provideHttpClient()` ersetzt
    - `HttpClientTestingModule` durch `provideHttpClientTesting()` ersetzt
    - `RouterTestingModule`  durch `provideRouter()` ersetzt

4. **Code-Anpassungen in der _isy-angular-widgets-demo_ Anwendung:**

    Anpassungen vorgenommen in:
    - `app.module.ts`
    - `objekt-suchen.component.spec.ts`
    - `objekt-anzeigen.component.spec.ts`

    Veraltete Module ersetzt:
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
                "@isyfact/eslint-plugin": "1.5.0",
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
            "@angular/common": "^18.1.3",
            "@angular/core": "^18.1.3",
            "moment": "^2.30.1",
            "primeflex": "^3.3.1",
            "primeicons": "^7.0.0",
            "primeng": "^17.18.7"
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
    - **Unit- und Integration-Tests:** Mit `npm run test` ausgeführt, um sicherzustellen, dass alle Tests bestehen.

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
