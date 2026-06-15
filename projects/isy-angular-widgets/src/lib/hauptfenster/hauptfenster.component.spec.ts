import {CommonModule} from '@angular/common';
import {Component, ElementRef, Input} from '@angular/core';
import {fakeAsync, tick} from '@angular/core/testing';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {BehaviorSubject} from 'rxjs';
import {MegaMenuItem} from 'primeng/api';
import {ButtonModule} from 'primeng/button';
import {UserInfo} from '../api/userinfo';
import {BrowserSupportCheckResult, BrowserVersionService} from '../browser-support/browser-version.service';
import {WidgetsConfigService} from '../i18n/widgets-config.service';
import {WidgetsTranslation} from '../i18n/widgets-translation';
import {HauptfensterComponent} from './hauptfenster.component';
import {SkipTarget} from './model/model';

@Component({selector: 'p-megaMenu', standalone: true, template: ''})
class MegaMenuStubComponent {
  @Input() model: MegaMenuItem[] = [];
}

@Component({selector: 'p-megaMenuSub', standalone: true, template: ''})
class MegaMenuSubStubComponent {}

@Component({selector: 'isy-skip-links', standalone: true, template: ''})
class SkipLinksStubComponent {
  @Input() links: SkipTarget[] = [];
}

@Component({
  selector: 'p-message',
  standalone: true,
  template: `
    <div [class]="styleClass" role="alert" aria-live="assertive" aria-atomic="true">
      <ng-content></ng-content>
    </div>
  `
})
class MessageStubComponent {
  @Input() severity?: string;
  @Input() icon?: string;
  @Input() styleClass?: string;
}

interface HauptfensterComponentTestAccess {
  linksNavigationHeader?: ElementRef<HTMLElement>;
  openLinksNavigation?: ElementRef<HTMLElement>;
  informationsbereichHeader?: ElementRef<HTMLElement>;
  openInformationsbereich?: ElementRef<HTMLElement>;
}

describe('Unit Tests: HauptfensterComponent', () => {
  let spectator: Spectator<HauptfensterComponent>;
  let component: HauptfensterComponent;
  let mockConfigService: jasmine.SpyObj<WidgetsConfigService>;
  let mockBrowserVersionService: jasmine.SpyObj<BrowserVersionService>;
  let translationSource: BehaviorSubject<WidgetsTranslation>;

  const supportedBrowserResult: BrowserSupportCheckResult = {
    supported: true,
    supportedBrowsers: [
      {
        label: 'Google Chrome',
        minimumVersion: '112'
      }
    ]
  };

  const unsupportedBrowserResult: BrowserSupportCheckResult = {
    supported: false,
    detectedBrowser: {
      name: 'chrome',
      label: 'Google Chrome',
      version: '1.0.0'
    },
    minimumVersion: '112',
    supportedBrowsers: [
      {
        label: 'Google Chrome',
        minimumVersion: '112'
      },
      {
        label: 'Microsoft Edge',
        minimumVersion: '112'
      }
    ]
  };

  const unsupportedUnknownBrowserResult: BrowserSupportCheckResult = {
    supported: false,
    supportedBrowsers: [
      {
        label: 'Google Chrome',
        minimumVersion: '112'
      },
      {
        label: 'Microsoft Edge',
        minimumVersion: '112'
      }
    ]
  };

  const createComponent = createComponentFactory({
    component: HauptfensterComponent,
    detectChanges: false,
    mocks: [WidgetsConfigService, BrowserVersionService],
    overrideComponents: [
      [
        HauptfensterComponent,
        {
          set: {
            imports: [
              CommonModule,
              ButtonModule,
              MegaMenuStubComponent,
              MegaMenuSubStubComponent,
              SkipLinksStubComponent,
              MessageStubComponent
            ]
          }
        }
      ]
    ]
  });

  const userInfo: UserInfo = {displayName: 'Max Mustermann'};

  const getComponentAccess = (): HauptfensterComponentTestAccess =>
    component as unknown as HauptfensterComponentTestAccess;

  const setupComponent = (
    browserSupportResult: BrowserSupportCheckResult = supportedBrowserResult,
    props: Partial<HauptfensterComponent> = {}
  ): void => {
    spectator = createComponent({
      props: {
        userInfo,
        ...props
      }
    });

    component = spectator.component;

    mockConfigService = spectator.inject(WidgetsConfigService);
    mockBrowserVersionService = spectator.inject(BrowserVersionService);
    translationSource = new BehaviorSubject<WidgetsTranslation>({});

    Object.defineProperty(mockConfigService, 'translation$', {
      configurable: true,
      value: translationSource.asObservable()
    });

    mockConfigService.getTranslation.and.callFake(
      (key: string, params: Record<string, string | number> = {}): string => {
        const translations: Record<string, string> = {
          'hauptfenster.logout': 'Abmelden',
          'hauptfenster.browserWarning.currentBrowserFallback': 'Ihr aktuell verwendeter Browser',
          'hauptfenster.browserWarning.message':
            '{{browser}} wird von dieser Anwendung nicht unterstützt. Bitte verwenden Sie eine unterstützte Browser-Version: {{supportedBrowsers}}.',
          'hauptfenster.browserWarning.supportedBrowser': '{{browser}} ab Version {{version}}'
        };

        return Object.entries(params).reduce(
          (result, [paramKey, replacement]) => result.replaceAll(`{{${paramKey}}}`, String(replacement)),
          translations[key] ?? key
        );
      }
    );

    mockBrowserVersionService.checkCurrentBrowser.and.returnValue(browserSupportResult);
    mockBrowserVersionService.checkCurrentBrowser.calls.reset();

    spectator.detectChanges();
  };

  beforeEach(() => {
    setupComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check the browser version by default', () => {
    expect(mockBrowserVersionService.checkCurrentBrowser).toHaveBeenCalled();
  });

  it('should not check the browser version when checkBrowserVersion is disabled', () => {
    setupComponent(supportedBrowserResult, {
      checkBrowserVersion: false
    });

    expect(mockBrowserVersionService.checkCurrentBrowser).not.toHaveBeenCalled();
    expect(spectator.query('.isy-hauptfenster-browser-warning')).toBeNull();
  });

  it('should not display a browser warning when the browser is supported', () => {
    expect(spectator.query('.isy-hauptfenster-browser-warning')).toBeNull();
  });

  it('should display a browser warning when the browser is unsupported', () => {
    setupComponent(unsupportedBrowserResult);

    const warning = spectator.query('.isy-hauptfenster-browser-warning') as HTMLElement;

    expect(warning).not.toBeNull();
    expect(warning.getAttribute('role')).toEqual('alert');
    expect(warning.getAttribute('aria-live')).toEqual('assertive');
    expect(warning.getAttribute('aria-atomic')).toEqual('true');
    expect(warning.textContent).toContain('Google Chrome 1.0.0');
    expect(warning.textContent).toContain('wird von dieser Anwendung nicht unterstützt');
    expect(warning.textContent).toContain('Google Chrome ab Version 112');
    expect(warning.textContent).toContain('Microsoft Edge ab Version 112');
  });

  it('should display the fallback browser text when the unsupported browser cannot be detected', () => {
    setupComponent(unsupportedUnknownBrowserResult);

    const warning = spectator.query('.isy-hauptfenster-browser-warning') as HTMLElement;

    expect(warning).not.toBeNull();
    expect(warning.textContent).toContain('Ihr aktuell verwendeter Browser');
    expect(warning.textContent).toContain('wird von dieser Anwendung nicht unterstützt');
    expect(warning.textContent).toContain('Google Chrome ab Version 112');
    expect(warning.textContent).toContain('Microsoft Edge ab Version 112');
  });

  it('should update the browser warning when translations change', () => {
    setupComponent(unsupportedBrowserResult);

    mockConfigService.getTranslation.and.callFake(
      (key: string, params: Record<string, string | number> = {}): string => {
        const translations: Record<string, string> = {
          'hauptfenster.logout': 'Logout',
          'hauptfenster.browserWarning.currentBrowserFallback': 'Your current browser',
          'hauptfenster.browserWarning.message':
            '{{browser}} is not supported by this application. Please use a supported browser version: {{supportedBrowsers}}.',
          'hauptfenster.browserWarning.supportedBrowser': '{{browser}} version {{version}} or later'
        };

        return Object.entries(params).reduce(
          (result, [paramKey, replacement]) => result.replaceAll(`{{${paramKey}}}`, String(replacement)),
          translations[key] ?? key
        );
      }
    );

    translationSource.next({});
    spectator.detectChanges();

    const warning = spectator.query('.isy-hauptfenster-browser-warning') as HTMLElement;

    expect(warning.textContent).toContain('Google Chrome 1.0.0');
    expect(warning.textContent).toContain('is not supported by this application');
    expect(warning.textContent).toContain('Google Chrome version 112 or later');
    expect(warning.textContent).toContain('Microsoft Edge version 112 or later');
  });

  it('should display the title input in Titelzeile', () => {
    const customTitle = 'Custom Title';
    spectator.setInput('title', customTitle);
    spectator.detectChanges();

    const titelzeileEl = spectator.query('.isy-hauptfenster-titelzeile') as HTMLElement;
    expect((titelzeileEl.textContent ?? '').trim()).toEqual(customTitle);
  });

  it('should show "Abmelden" as the title of the logout button', () => {
    const logoutButton = spectator.query('#isy-hauptfenster-logout-button') as HTMLElement;
    expect((logoutButton.textContent ?? '').trim()).toEqual('Abmelden');
  });

  it('should call the logout function when the button is clicked', () => {
    const spy = spyOn(component.logoutEvent, 'emit');
    const logoutButton = spectator.query('#isy-hauptfenster-logout-button button') as HTMLButtonElement;

    spectator.click(logoutButton);
    expect(spy).toHaveBeenCalledWith(component.userInfo);
  });

  it('should have a hidden linksnavigation by default', () => {
    const linksnavigation = spectator.query('.isy-hauptfenster-linksnavigation');
    expect(linksnavigation).toBeFalsy();
  });

  it('should have a hidden informationsbereich by default', () => {
    const informationsbereich = spectator.query('.isy-hauptfenster-informationsbereich');
    expect(informationsbereich).toBeFalsy();
  });

  it('should use the provided Linksnavigation width', () => {
    const customLinksnavigationWidth = '10%';
    spectator.setInput('linksNavigationWidth', customLinksnavigationWidth);
    spectator.setInput('showLinksnavigation', true);
    spectator.detectChanges();

    const linksnavigation = spectator.query('.isy-hauptfenster-linksnavigation') as HTMLElement;
    expect(linksnavigation.style.width).toEqual(customLinksnavigationWidth);
  });

  it('should use the provided Informationsbereich width', () => {
    const customInformationsbereichWidth = '10%';
    spectator.setInput('informationsbereichWidth', customInformationsbereichWidth);
    spectator.setInput('showInformationsbereich', true);
    spectator.detectChanges();

    const informationsbereich = spectator.query('.isy-hauptfenster-informationsbereich') as HTMLElement;
    expect(informationsbereich.style.width).toEqual(customInformationsbereichWidth);
  });

  it('should not change its Linksnavigation width when collapsed', fakeAsync(() => {
    spectator.setInput('showLinksnavigation', true);
    spectator.detectChanges();

    const linksnavigation = spectator.query('.isy-hauptfenster-linksnavigation') as HTMLElement;
    const collapseButton = linksnavigation.querySelector('.p-button-text') as HTMLElement;

    spectator.click(collapseButton);
    spectator.detectChanges();
    tick();

    const width = linksnavigation.style.width;

    spectator.setInput('linksNavigationWidth', '20%');
    spectator.detectChanges();
    tick();
    expect(linksnavigation.style.width).toEqual(width);

    spectator.setInput('linksNavigationWidth', '10%');
    spectator.detectChanges();
    tick();
    expect(linksnavigation.style.width).toEqual(width);
  }));

  it('should not change its Informationsbereich width when collapsed', fakeAsync(() => {
    spectator.setInput('showInformationsbereich', true);
    spectator.detectChanges();

    const informationsbereich = spectator.query('.isy-hauptfenster-informationsbereich') as HTMLElement;
    const collapseButton = informationsbereich.querySelector('.p-button-text') as HTMLElement;

    spectator.click(collapseButton);
    spectator.detectChanges();
    tick();

    const width = informationsbereich.style.width;

    spectator.setInput('informationsbereichWidth', '20%');
    spectator.detectChanges();
    tick();
    expect(informationsbereich.style.width).toEqual(width);

    spectator.setInput('informationsbereichWidth', '10%');
    spectator.detectChanges();
    tick();
    expect(informationsbereich.style.width).toEqual(width);
  }));

  it('should display the linksNavigationTitle when Linksnavigation is shown', () => {
    spectator.setInput('showLinksnavigation', true);
    spectator.setInput('linksNavigationTitle', 'Custom Title');
    spectator.detectChanges();

    const labelElement = spectator.query('span.font-bold') as HTMLElement;
    expect(labelElement).toBeTruthy();
    expect(labelElement.textContent).toContain('Custom Title');
  });

  it('should focus the first focusable element in links navigation header when sidebar is collapsed', fakeAsync(() => {
    const container = document.createElement('div');
    const button = document.createElement('button');
    container.appendChild(button);

    const focusSpy = spyOn(button, 'focus');

    const componentAccess = getComponentAccess();
    componentAccess.linksNavigationHeader = {
      nativeElement: container
    };

    component.collapseSidebar();
    spectator.detectChanges();
    tick();

    expect(component.collapsedLinksnavigation).toBeTrue();
    expect(focusSpy).toHaveBeenCalled();
  }));

  it('should focus the first focusable element in links navigation when sidebar is expanded', fakeAsync(() => {
    const container = document.createElement('div');
    const link = document.createElement('a');
    link.href = '#';
    container.appendChild(link);

    const focusSpy = spyOn(link, 'focus');

    const componentAccess = getComponentAccess();
    componentAccess.openLinksNavigation = {
      nativeElement: container
    };

    component.expandSidebar();
    spectator.detectChanges();
    tick();

    expect(component.collapsedLinksnavigation).toBeFalse();
    expect(focusSpy).toHaveBeenCalled();
  }));

  it('should focus the first focusable element in information area header when information area is collapsed', fakeAsync(() => {
    const container = document.createElement('div');
    const button = document.createElement('button');
    container.appendChild(button);

    const focusSpy = spyOn(button, 'focus');

    const componentAccess = getComponentAccess();
    componentAccess.informationsbereichHeader = {
      nativeElement: container
    };

    component.collapseInformationsbereich();
    spectator.detectChanges();
    tick();

    expect(component.collapsedInformationsbereich).toBeTrue();
    expect(focusSpy).toHaveBeenCalled();
  }));

  it('should focus the first focusable element in information area when information area is expanded', fakeAsync(() => {
    const container = document.createElement('div');
    const input = document.createElement('input');
    container.appendChild(input);

    const focusSpy = spyOn(input, 'focus');

    const componentAccess = getComponentAccess();
    componentAccess.openInformationsbereich = {
      nativeElement: container
    };

    component.expandInformationsbereich();
    spectator.detectChanges();
    tick();

    expect(component.collapsedInformationsbereich).toBeFalse();
    expect(focusSpy).toHaveBeenCalled();
  }));

  it('banner landmark/tag should be available', () => {
    expect(spectator.query('header')).not.toBeNull();
  });

  it('main landmark/tag should be available', () => {
    expect(spectator.query('main')).not.toBeNull();
  });

  it('nav landmark/tag should be available', () => {
    expect(spectator.query('nav')).not.toBeNull();
  });

  it('aside (linksnavigation) landmark/tag should be available', () => {
    spectator.setInput('showLinksnavigation', true);
    spectator.detectChanges();

    expect(spectator.query('.isy-hauptfenster-linksnavigation')).not.toBeNull();
  });

  it('aside (informationsbereich) landmark/tag should be available', () => {
    spectator.setInput('showInformationsbereich', true);
    spectator.detectChanges();

    expect(spectator.query('.isy-hauptfenster-informationsbereich')).not.toBeNull();
  });
});

describe('Integration Test: HauptfensterComponent', () => {
  let spectator: Spectator<HauptfensterComponent>;

  const createComponent = createComponentFactory({
    component: HauptfensterComponent,
    imports: [ButtonModule],
    providers: [
      {
        provide: BrowserVersionService,
        useValue: {
          checkCurrentBrowser: (): BrowserSupportCheckResult => ({
            supported: true,
            supportedBrowsers: [
              {
                label: 'Google Chrome',
                minimumVersion: '112'
              }
            ]
          })
        }
      }
    ]
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should display custom title if titel input is used', () => {
    const customTitle = 'Custom Title';

    spectator = createComponent({
      props: {title: customTitle}
    });

    const titelzeileEl = spectator.query('.isy-hauptfenster-titelzeile') as HTMLElement;
    expect((titelzeileEl.textContent ?? '').trim()).toEqual(customTitle);
  });

  it('should have outlined style when outlinedLogoutButton is true', () => {
    spectator = createComponent({
      props: {outlinedLogoutButton: true}
    });

    const logoutButton = spectator.query('#isy-hauptfenster-logout-button button') as HTMLButtonElement;
    expect(logoutButton).toHaveClass('p-button-outlined');
  });

  it('should not have outlined style when outlinedLogoutButton is false', () => {
    spectator = createComponent({
      props: {outlinedLogoutButton: false}
    });

    const logoutButton = spectator.query('#isy-hauptfenster-logout-button button') as HTMLButtonElement;
    expect(logoutButton).not.toHaveClass('p-button-outlined');
  });
});
