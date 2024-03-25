import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {SeitentoolbarComponent} from './seitentoolbar.component';
import {RouterTestingModule} from '@angular/router/testing';
import {Router} from '@angular/router';
import {ToolbarModule} from 'primeng/toolbar';
import {ButtonModule} from 'primeng/button';

describe('SeitenToolbarComponent', () => {
  let spectator: Spectator<SeitentoolbarComponent>;
  let component: SeitentoolbarComponent;
  let mockRouter: Router;

  const createComponent = createComponentFactory({
    component: SeitentoolbarComponent,
    imports: [ToolbarModule, ButtonModule, RouterTestingModule]
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    mockRouter = spectator.inject(Router);
  });

  it('should create', () => {
    expect(spectator).toBeTruthy();
    expect(component).toBeTruthy();
  });

  it('should display the sidebarHomeButtonLabel input value', () => {
    const testLabel = 'Home';
    spectator.setInput('showSidebar', true);
    spectator.setInput('sidebarHomeButtonLabel', testLabel);
    const buttonElement = spectator.query('.p-toolbar-left p-button');
    expect(buttonElement).toBeTruthy();
    expect(buttonElement?.textContent).toContain(testLabel);
  });

  it('should navigate home when navigateHome is called', async () => {
    const navigateSpy = spyOn(mockRouter, 'navigate').and.returnValue(Promise.resolve(true));
    await component.navigateHome();
    expect(navigateSpy).toHaveBeenCalledWith([component.sidebarHomeRoute]);
  });

  it('should navigate to the route defined by homeRoute input when navigateHome is called', async () => {
    const testRoute = '/custom-home';
    spectator.setInput('sidebarHomeRoute', testRoute);
    const navigateSpy = spyOn(mockRouter, 'navigate').and.returnValue(Promise.resolve(true));
    await spectator.component.navigateHome();
    expect(navigateSpy).toHaveBeenCalledWith([testRoute]);
  });

  it('should display the Seitentoolbar when showSidebar is true', () => {
    spectator.setInput('showSidebar', true);
    spectator.fixture.detectChanges();
    const toolbar = spectator.query('.p-toolbar-left');
    expect(toolbar).toExist();
  });

  it('should not display the Seitentoolbar when showSidebar is false', () => {
    spectator.setInput('showSidebar', false);
    spectator.fixture.detectChanges();
    const toolbar = spectator.query('.p-toolbar-left');
    expect(toolbar).not.toExist();
  });
});
