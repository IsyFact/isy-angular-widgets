import {HauptfensterComponent} from './hauptfenster.component';
import {Component} from '@angular/core';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {MegaMenu, MegaMenuSub} from 'primeng/megamenu';
import {Button} from 'primeng/button';
import {MockComponents} from 'ng-mocks';
import {HauptfensterModule} from './hauptfenster.module';
import {UserInfo} from '../api/userinfo';
import {WidgetsConfigService} from '../i18n/widgets-config.service';

@Component({
  template: `
    <isy-hauptfenster [title]="title" [userInfo]="userInfo">
      <div Titelzeile>
        <h1 class="custom-title">Titel inside H1!</h1>
      </div>
    </isy-hauptfenster>
  `
})
class HauptFensterWrapperComponent {
  title!: string;
}

describe('Unit Tests: HauptfensterComponent', () => {
  let spectator: Spectator<HauptfensterComponent>;
  let component: HauptfensterComponent;
  let mockConfigService: jasmine.SpyObj<WidgetsConfigService>;
  const createComponent = createComponentFactory({
    component: HauptfensterComponent,
    declarations: [MockComponents(Button, MegaMenu, MegaMenuSub)],
    mocks: [WidgetsConfigService]
  });

  const userInfo: UserInfo = {
    displayName: 'Max Mustermann'
  };

  beforeEach(() => {
    spectator = createComponent({props: {userInfo}});
    component = spectator.component;
    mockConfigService = spectator.inject(WidgetsConfigService);
    mockConfigService.getTranslation.and.callFake((key: string) => {
      const translations: {[key: string]: string} = {
        'hauptfenster.logout': 'Abmelden'
      };
      return translations[key];
    });
    spectator.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title input in Titelzeile', () => {
    const customTitle = 'Custom Title';
    component.title = customTitle;
    spectator.fixture.detectChanges();
    const titelzeileEl = spectator.query('.isy-hauptfenster-titelzeile') as HTMLElement;

    expect(titelzeileEl.textContent).toEqual(customTitle);
  });

  it('should show "Abmelden" as the title of the logout button', () => {
    const logoutTitle = 'Abmelden';
    const logoutButton = spectator.query('#isy-hauptfenster-logout-button') as HTMLButtonElement;
    const logoutButtonText = logoutButton.textContent ?? '';
    expect(logoutButtonText.trim()).toEqual(logoutTitle);
  });

  it('should call the logout function when the button is clocked', () => {
    const spy = spyOn(component.logoutEvent, 'emit');
    const logoutButton = spectator.query('#isy-hauptfenster-logout-button') as HTMLButtonElement;
    logoutButton.click();
    expect(spy).toHaveBeenCalledWith(component.userInfo);
  });

  it('should have a hidden linksnavigation by default', () => {
    const linksnavigation = spectator.query('.isy-hauptfenster-linksnavigation') as HTMLElement;
    expect(linksnavigation).toBeFalsy();
  });

  it('should have a hidden informationsbereich by default', () => {
    const informationsbereich = spectator.query('.isy-hauptfenster-informationsbereich') as HTMLElement;
    expect(informationsbereich).toBeFalsy();
  });

  it('should use the provided Linksnavigation width', () => {
    const customLinksnavigationWidth = '10%';
    component.linksNavigationWidth = customLinksnavigationWidth;
    component.showLinksnavigation = true;
    spectator.fixture.detectChanges();
    const linksnavigation = spectator.query('.isy-hauptfenster-linksnavigation') as HTMLElement;
    expect(linksnavigation.style.width).toEqual(customLinksnavigationWidth);
  });

  it('should use the provided Informationsbereich width', () => {
    const customInformationsbereichWidth = '10%';
    component.informationsbereichWidth = customInformationsbereichWidth;
    component.showInformationsbereich = true;
    spectator.fixture.detectChanges();
    const informationsbereich = spectator.query('.isy-hauptfenster-informationsbereich') as HTMLElement;
    expect(informationsbereich.style.width).toEqual(customInformationsbereichWidth);
  });

  it('should not change its Linksnavigation width when collapsed', () => {
    component.showLinksnavigation = true;
    spectator.fixture.detectChanges();
    const linksnavigation = spectator.query('.isy-hauptfenster-linksnavigation') as HTMLElement;
    (linksnavigation.querySelector('.p-button-text') as HTMLElement).click();
    spectator.fixture.detectChanges();
    const width = linksnavigation.style.width;

    component.linksNavigationWidth = '20%';
    spectator.fixture.detectChanges();

    expect(linksnavigation.style.width).toEqual(width);

    component.linksNavigationWidth = '10%';
    spectator.fixture.detectChanges();

    expect(linksnavigation.style.width).toEqual(width);
  });

  it('should not change its Informationsbereich width when collapsed', () => {
    component.showInformationsbereich = true;
    spectator.fixture.detectChanges();
    const informationsbereich = spectator.query('.isy-hauptfenster-informationsbereich') as HTMLElement;
    (informationsbereich.querySelector('.p-button-text') as HTMLElement).click();
    spectator.fixture.detectChanges();
    const width = informationsbereich.style.width;

    component.linksNavigationWidth = '20%';
    spectator.fixture.detectChanges();

    expect(informationsbereich.style.width).toEqual(width);

    component.linksNavigationWidth = '10%';
    spectator.fixture.detectChanges();

    expect(informationsbereich.style.width).toEqual(width);
  });

  it('should display the linksNavigationTitle when Linksnavigation is shown', () => {
    component.showLinksnavigation = true;
    const customLinksNavigationTitle = 'Custom Title';
    component.linksNavigationTitle = customLinksNavigationTitle;

    spectator.fixture.detectChanges();

    const labelElement = spectator.query('span.font-bold') as HTMLElement;

    expect(labelElement).toBeTruthy();
    expect(labelElement.textContent).toContain(customLinksNavigationTitle);
  });

  it('banner landmark/tag should be available', () => {
    const div = spectator.query('header') as HTMLElement;
    expect(div).not.toBeNull();
  });

  it('main landmark/tag should be available', () => {
    const div = spectator.query('main') as HTMLElement;
    expect(div).not.toBeNull();
  });

  it('nav landmark/tag should be available', () => {
    const div = spectator.query('nav') as HTMLElement;
    expect(div).not.toBeNull();
  });

  it('aside (linksnavigation) landmark/tag should be available', () => {
    component.showLinksnavigation = true;
    spectator.detectChanges();

    const div = spectator.query('.isy-hauptfenster-linksnavigation') as HTMLElement;
    expect(div).not.toBeNull();
  });

  it('aside (informationsbereich) landmark/tag should be available', () => {
    component.showInformationsbereich = true;
    spectator.detectChanges();

    const div = spectator.query('.isy-hauptfenster-informationsbereich') as HTMLElement;
    expect(div).not.toBeNull();
  });
});

describe('Integration Test: HauptfensterComponent', () => {
  let spectator: Spectator<HauptFensterWrapperComponent>;
  const createComponent = createComponentFactory({
    component: HauptFensterWrapperComponent,
    imports: [HauptfensterModule]
  });

  beforeEach(() => (spectator = createComponent()));

  it('should display custom title in template of Titelzeile if titel input is undefined', () => {
    const titelzeileEl = spectator.query('.isy-hauptfenster-titelzeile') as HTMLElement;
    expect(titelzeileEl.textContent).toEqual('Titel inside H1!');
  });

  it('should display custom title if titel input is used', () => {
    const customTitle = 'Custom Title';
    spectator.component.title = customTitle;
    spectator.fixture.detectChanges();
    const titelzeileEl = spectator.query('.isy-hauptfenster-titelzeile') as HTMLElement;
    expect(titelzeileEl.textContent).toEqual(customTitle);
  });
});
