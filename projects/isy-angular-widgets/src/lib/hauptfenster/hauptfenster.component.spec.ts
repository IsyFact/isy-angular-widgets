import {HauptfensterComponent} from './hauptfenster.component';
import {Component, Input} from '@angular/core';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {MegaMenu, MegaMenuSub} from 'primeng/megamenu';
import {Button} from 'primeng/button';
import {MockComponent} from 'ng-mocks';

@Component({
  template: `
    <isy-hauptfenster [title]="title">
      <div Titelzeile>
        <h1 class="custom-title">Titel inside H1!</h1>
      </div>
    </isy-hauptfenster>
  `
})
class HauptFensterWrapperComponent {
  @Input() title!: string;
}

let spectator: Spectator<HauptfensterComponent>;

describe('Unit Tests: HauptfensterComponent', () => {

  const createdComponent = createComponentFactory({
    component: HauptfensterComponent,
    declarations: [MockComponent(Button), MockComponent(MegaMenu), MockComponent(MegaMenuSub)]
  });

  beforeEach(() => (spectator = createdComponent()));

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should display the title input in Titelzeile', () => {
    const customTitle = 'Custom Title';
    spectator.component.title = customTitle;
    spectator.fixture.detectChanges();
    const titelzeileEl = spectator.fixture.nativeElement.querySelector('.isy-hauptfenster-titelzeile') as HTMLElement;

    expect(titelzeileEl.textContent).toEqual(customTitle);
  });

  it('should show "Abmelden" as the title of the logout button', () => {
    const logoutTitle = 'Abmelden';
    const logoutButton = spectator.fixture.nativeElement.querySelector(
      '#isy-hauptfenster-logout-button'
    ) as HTMLButtonElement;
    const logoutButtonText = logoutButton.textContent ?? '';
    expect(logoutButtonText.trim()).toEqual(logoutTitle);
  });

  it('should call the logout function when the button is clocked', () => {
    const spy = spyOn(spectator.component.logoutEvent, 'emit');
    const logoutButton = spectator.fixture.nativeElement.querySelector(
      '#isy-hauptfenster-logout-button'
    ) as HTMLButtonElement;
    logoutButton.click();
    expect(spy).toHaveBeenCalledWith(spectator.component.userInfo);
  });

  it('should have a hidden linksnavigation by default', () => {
    const linksnavigation = spectator.fixture.nativeElement.querySelector(
      '.isy-hauptfenster-linksnavigation'
    ) as HTMLElement;
    expect(linksnavigation).toBeFalsy();
  });

  it('should have a hidden informationsbereich by default', () => {
    const informationsbereich = spectator.fixture.nativeElement.querySelector(
      '.isy-hauptfenster-informationsbereich'
    ) as HTMLElement;
    expect(informationsbereich).toBeFalsy();
  });

  it('should use the provided Linksnavigation width', () => {
    const customLinksnavigationWidth = '5em';
    spectator.component.linksNavigationWidth = customLinksnavigationWidth;
    spectator.component.showLinksnavigation = true;
    spectator.fixture.detectChanges();
    const linksnavigation = spectator.fixture.nativeElement.querySelector('#open-links-navigation') as HTMLElement;
    expect(linksnavigation.style.width).toEqual(customLinksnavigationWidth);
  });

  it('should use the provided Informationsbereich width', () => {
    const customInformationsbereichWidth = '5em';
    spectator.component.informationsbereichWidth = customInformationsbereichWidth;
    spectator.component.showInformationsbereich = true;
    spectator.fixture.detectChanges();
    const informationsbereich = spectator.fixture.nativeElement.querySelector(
      '#open-informationsbereich'
    ) as HTMLElement;
    expect(informationsbereich.style.width).toEqual(customInformationsbereichWidth);
  });
});

describe('Integration Test: HauptfensterComponent', () => {
  let spectator: Spectator<HauptFensterWrapperComponent>;
  const createdComponent = createComponentFactory({
    component: HauptFensterWrapperComponent,
    declarations: [HauptfensterComponent, MockComponent(Button), MockComponent(MegaMenu), MockComponent(MegaMenuSub)]
  });

  beforeEach(() => (spectator = createdComponent()));

  it('should display custom html in template of Titelzeile', () => {
    const titelzeileEl = spectator.fixture.nativeElement.querySelector('.isy-hauptfenster-titelzeile') as HTMLElement;
    const h1El = titelzeileEl.querySelector('.custom-title');
    expect(h1El!.textContent).toEqual('Titel inside H1!');
  });

  it('should not display custom html in Titelzeile if titel input is used', () => {
    const customTitle = 'Custom Title';
    spectator.component.title = customTitle;
    spectator.fixture.detectChanges();
    const titelzeileEl = spectator.fixture.nativeElement.querySelector('.isy-hauptfenster-titelzeile') as HTMLElement;
    expect(titelzeileEl.textContent).toEqual(customTitle);
  });
});
