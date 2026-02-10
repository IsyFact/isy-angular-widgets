import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {ButtonModule} from 'primeng/button';
import {MegaMenuItem} from 'primeng/api';
import {HauptfensterComponent} from './hauptfenster.component';
import {UserInfo} from '../api/userinfo';
import {WidgetsConfigService} from '../i18n/widgets-config.service';
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

describe('Unit Tests: HauptfensterComponent', () => {
  let spectator: Spectator<HauptfensterComponent>;
  let component: HauptfensterComponent;
  let mockConfigService: jasmine.SpyObj<WidgetsConfigService>;

  const createComponent = createComponentFactory({
    component: HauptfensterComponent,
    detectChanges: false,
    mocks: [WidgetsConfigService],
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
              SkipLinksStubComponent
            ]
          }
        }
      ]
    ]
  });

  const userInfo: UserInfo = {displayName: 'Max Mustermann'};

  beforeEach(() => {
    spectator = createComponent({props: {userInfo}});
    component = spectator.component;

    mockConfigService = spectator.inject(WidgetsConfigService);
    mockConfigService.getTranslation.and.callFake((key: string) => {
      const translations: {[key: string]: string} = {
        'hauptfenster.logout': 'Abmelden'
      };
      return translations[key] ?? key;
    });

    spectator.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title input in Titelzeile', () => {
    const customTitle = 'Custom Title';
    spectator.setInput('title', customTitle);
    spectator.detectChanges();

    const titelzeileEl = spectator.query('.isy-hauptfenster-titelzeile') as HTMLElement;
    expect(titelzeileEl.textContent).toEqual(customTitle);
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

  it('should not change its Linksnavigation width when collapsed', () => {
    spectator.setInput('showLinksnavigation', true);
    spectator.detectChanges();

    const linksnavigation = spectator.query('.isy-hauptfenster-linksnavigation') as HTMLElement;
    (linksnavigation.querySelector('.p-button-text') as HTMLElement).click();
    spectator.detectChanges();

    const width = linksnavigation.style.width;

    spectator.setInput('linksNavigationWidth', '20%');
    spectator.detectChanges();
    expect(linksnavigation.style.width).toEqual(width);

    spectator.setInput('linksNavigationWidth', '10%');
    spectator.detectChanges();
    expect(linksnavigation.style.width).toEqual(width);
  });

  it('should not change its Informationsbereich width when collapsed', () => {
    spectator.setInput('showInformationsbereich', true);
    spectator.detectChanges();

    const informationsbereich = spectator.query('.isy-hauptfenster-informationsbereich') as HTMLElement;
    (informationsbereich.querySelector('.p-button-text') as HTMLElement).click();
    spectator.detectChanges();

    const width = informationsbereich.style.width;

    spectator.setInput('informationsbereichWidth', '20%');
    spectator.detectChanges();
    expect(informationsbereich.style.width).toEqual(width);

    spectator.setInput('informationsbereichWidth', '10%');
    spectator.detectChanges();
    expect(informationsbereich.style.width).toEqual(width);
  });

  it('should display the linksNavigationTitle when Linksnavigation is shown', () => {
    spectator.setInput('showLinksnavigation', true);
    spectator.setInput('linksNavigationTitle', 'Custom Title');
    spectator.detectChanges();

    const labelElement = spectator.query('span.font-bold') as HTMLElement;
    expect(labelElement).toBeTruthy();
    expect(labelElement.textContent).toContain('Custom Title');
  });

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
    imports: [ButtonModule]
  });

  beforeEach(() => (spectator = createComponent()));

  it('should display custom title if titel input is used', () => {
    const customTitle = 'Custom Title';

    spectator = createComponent({
      props: {title: customTitle}
    });

    const titelzeileEl = spectator.query('.isy-hauptfenster-titelzeile') as HTMLElement;
    expect(titelzeileEl.textContent).toEqual(customTitle);
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
