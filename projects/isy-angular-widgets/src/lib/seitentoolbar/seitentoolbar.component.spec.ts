import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {provideRouter, Router} from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {ToolbarModule} from 'primeng/toolbar';
import {WidgetsConfigService} from '../i18n/widgets-config.service';
import {SeitentoolbarComponent} from './seitentoolbar.component';

describe('SeitentoolbarComponent', () => {
  let spectator: Spectator<SeitentoolbarComponent>;
  let component: SeitentoolbarComponent;
  let mockRouter: Router;
  let configService: WidgetsConfigService;

  const createComponent = createComponentFactory({
    component: SeitentoolbarComponent,
    imports: [ToolbarModule, ButtonModule],
    providers: [provideRouter([])]
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    mockRouter = spectator.inject(Router);
    configService = spectator.inject(WidgetsConfigService);
  });

  /**
   * Returns a required element from the rendered component.
   * @param selector The CSS selector of the required element.
   * @returns The matching element.
   */
  function getRequiredElement<T extends Element>(selector: string): T {
    const element = spectator.query<T>(selector);

    if (!element) {
      throw new Error(`Element "${selector}" was not found.`);
    }

    return element;
  }

  it('should create', () => {
    expect(spectator).toBeTruthy();
    expect(component).toBeTruthy();
  });

  it('should display the Seitentoolbar when showSidebar is true', () => {
    spectator.setInput('showSidebar', true);

    expect(spectator.query('.p-toolbar-left')).toExist();
  });

  it('should not display the Seitentoolbar when showSidebar is false', () => {
    spectator.setInput('showSidebar', false);

    expect(spectator.query('.p-toolbar-left')).not.toExist();
  });

  it('should display the sidebarHomeButtonLabel input value', () => {
    const testLabel = 'Home';

    spectator.setInput({
      showSidebar: true,
      sidebarHomeButtonLabel: testLabel
    });

    const labelElement = getRequiredElement<HTMLElement>('.p-button-label');

    expect(labelElement.textContent?.trim()).toBe(testLabel);
  });

  it('should use the sidebarHomeButtonAriaLabel as accessible label', () => {
    const testAriaLabel = 'Navigate to Home';

    spectator.setInput({
      showSidebar: true,
      sidebarHomeButtonLabel: 'Home',
      sidebarHomeButtonAriaLabel: testAriaLabel
    });

    const buttonElement = getRequiredElement<HTMLButtonElement>('button.p-button');

    expect(buttonElement.getAttribute('aria-label')).toBe(testAriaLabel);
  });

  it('should prefer sidebarHomeButtonAriaLabel over all fallback values', () => {
    configService.setTranslation({
      seitentoolbar: {
        back: 'Configured translation'
      }
    });

    spectator.setInput({
      showSidebar: true,
      sidebarHomeButtonLabel: 'Visible label',
      sidebarHomeButtonAriaLabel: 'Accessible label'
    });

    const buttonElement = getRequiredElement<HTMLButtonElement>('button.p-button');

    expect(buttonElement.getAttribute('aria-label')).toBe('Accessible label');
  });

  it('should use sidebarHomeButtonLabel as accessible label fallback', () => {
    configService.setTranslation({
      seitentoolbar: {
        back: 'Configured translation'
      }
    });

    spectator.setInput({
      showSidebar: true,
      sidebarHomeButtonLabel: 'Back to home',
      sidebarHomeButtonAriaLabel: undefined
    });

    const buttonElement = getRequiredElement<HTMLButtonElement>('button.p-button');

    expect(buttonElement.getAttribute('aria-label')).toBe('Back to home');
  });

  it('should use the default translation as accessible label fallback', () => {
    spectator.setInput({
      showSidebar: true,
      sidebarHomeButtonLabel: undefined,
      sidebarHomeButtonAriaLabel: undefined
    });

    const buttonElement = getRequiredElement<HTMLButtonElement>('button.p-button');

    expect(buttonElement.getAttribute('aria-label')).toBe('Zurück zur Übersicht');
  });

  it('should use a custom translation as accessible label fallback', () => {
    configService.setTranslation({
      seitentoolbar: {
        back: 'Back to overview'
      }
    });

    spectator.setInput({
      showSidebar: true,
      sidebarHomeButtonLabel: undefined,
      sidebarHomeButtonAriaLabel: undefined
    });

    const buttonElement = getRequiredElement<HTMLButtonElement>('button.p-button');

    expect(buttonElement.getAttribute('aria-label')).toBe('Back to overview');
  });

  it('should transform the empty responsive attribute value to true', () => {
    spectator.fixture.componentRef.setInput('responsive', '');
    spectator.detectChanges();

    expect(component.responsive).toBeTrue();
  });

  it('should transform the string value false to false', () => {
    spectator.fixture.componentRef.setInput('responsive', 'false');
    spectator.detectChanges();

    expect(component.responsive).toBeFalse();
  });

  it('should add the responsive CSS class when responsive is true', () => {
    spectator.setInput({
      showSidebar: true,
      responsive: true
    });

    const toolbarElement = getRequiredElement<HTMLElement>('p-toolbar');

    expect(toolbarElement.classList.contains('isy-seiten-toolbar-responsive')).toBeTrue();
  });

  it('should not add the responsive CSS class when responsive is false', () => {
    spectator.setInput({
      showSidebar: true,
      responsive: false
    });

    const toolbarElement = getRequiredElement<HTMLElement>('p-toolbar');

    expect(toolbarElement.classList.contains('isy-seiten-toolbar-responsive')).toBeFalse();
  });

  it('should render the home button with an icon', () => {
    spectator.setInput('showSidebar', true);

    const iconElement = getRequiredElement<HTMLElement>('.p-button-icon');

    expect(iconElement.classList.contains('pi')).toBeTrue();
    expect(iconElement.classList.contains('pi-arrow-circle-left')).toBeTrue();
  });

  it('should keep an accessible label when responsive is enabled', () => {
    spectator.setInput({
      showSidebar: true,
      responsive: true,
      sidebarHomeButtonLabel: 'Zurück',
      sidebarHomeButtonAriaLabel: 'Zurück zur Übersicht'
    });

    const buttonElement = getRequiredElement<HTMLButtonElement>('button.p-button');

    expect(buttonElement.getAttribute('aria-label')).toBe('Zurück zur Übersicht');
  });

  it('should navigate home when navigateHome is called', async () => {
    const navigateSpy = spyOn(mockRouter, 'navigate').and.returnValue(Promise.resolve(true));

    await component.navigateHome();

    expect(navigateSpy).toHaveBeenCalledWith([component.sidebarHomeRoute]);
  });

  it('should navigate to the configured route when navigateHome is called', async () => {
    const testRoute = '/custom-home';
    spectator.setInput('sidebarHomeRoute', testRoute);

    const navigateSpy = spyOn(mockRouter, 'navigate').and.returnValue(Promise.resolve(true));

    await component.navigateHome();

    expect(navigateSpy).toHaveBeenCalledWith([testRoute]);
  });

  it('should navigate to the configured route when the home button is clicked', async () => {
    const testRoute = '/custom-home';

    const navigateSpy = spyOn(mockRouter, 'navigate').and.returnValue(Promise.resolve(true));

    spectator.setInput({
      showSidebar: true,
      sidebarHomeRoute: testRoute
    });

    spectator.click('button.p-button');
    await spectator.fixture.whenStable();

    expect(navigateSpy).toHaveBeenCalledWith([testRoute]);
  });
});
