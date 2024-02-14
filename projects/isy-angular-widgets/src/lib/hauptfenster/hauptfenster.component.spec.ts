import {HauptfensterComponent} from './hauptfenster.component';
import {Component} from '@angular/core';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {MegaMenu, MegaMenuSub} from 'primeng/megamenu';
import {Button} from 'primeng/button';
import {MockComponents} from 'ng-mocks';
import {HauptfensterModule} from './hauptfenster.module';

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
  title!: string;
}

describe('Unit Tests: HauptfensterComponent', () => {
  let spectator: Spectator<HauptfensterComponent>;
  const createComponent = createComponentFactory({
    component: HauptfensterComponent,
    declarations: [MockComponents(Button, MegaMenu, MegaMenuSub)]
  });

  beforeEach(() => (spectator = createComponent()));

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should display the title input in Titelzeile', () => {
    const customTitle = 'Custom Title';
    spectator.component.title = customTitle;
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
    const spy = spyOn(spectator.component.logoutEvent, 'emit');
    const logoutButton = spectator.query('#isy-hauptfenster-logout-button') as HTMLButtonElement;
    logoutButton.click();
    expect(spy).toHaveBeenCalledWith(spectator.component.userInfo);
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
    spectator.component.linksNavigationWidth = customLinksnavigationWidth;
    spectator.component.showLinksnavigation = true;
    spectator.fixture.detectChanges();
    const linksnavigation = spectator.query('.isy-hauptfenster-linksnavigation') as HTMLElement;
    expect(linksnavigation.style.width).toEqual(customLinksnavigationWidth);
  });

  it('should use the provided Informationsbereich width', () => {
    const customInformationsbereichWidth = '10%';
    spectator.component.informationsbereichWidth = customInformationsbereichWidth;
    spectator.component.showInformationsbereich = true;
    spectator.fixture.detectChanges();
    const informationsbereich = spectator.query('.isy-hauptfenster-informationsbereich') as HTMLElement;
    expect(informationsbereich.style.width).toEqual(customInformationsbereichWidth);
  });

  it('should not change its Linksnavigation width when collapsed', () => {
    spectator.component.showLinksnavigation = true;
    spectator.fixture.detectChanges();
    const linksnavigation = spectator.query('.isy-hauptfenster-linksnavigation') as HTMLElement;
    (linksnavigation.querySelector('.collapseButton button') as HTMLElement).click();
    spectator.fixture.detectChanges();
    const width = linksnavigation.style.width;

    spectator.component.linksNavigationWidth = '20%';
    spectator.fixture.detectChanges();

    expect(linksnavigation.style.width).toEqual(width);

    spectator.component.linksNavigationWidth = '10%';
    spectator.fixture.detectChanges();

    expect(linksnavigation.style.width).toEqual(width);
  });

  it('should not change its Informationsbereich width when collapsed', () => {
    spectator.component.showInformationsbereich = true;
    spectator.fixture.detectChanges();
    const informationsbereich = spectator.query('.isy-hauptfenster-informationsbereich') as HTMLElement;
    (informationsbereich.querySelector('.collapseButton button') as HTMLElement).click();
    spectator.fixture.detectChanges();
    const width = informationsbereich.style.width;

    spectator.component.linksNavigationWidth = '20%';
    spectator.fixture.detectChanges();

    expect(informationsbereich.style.width).toEqual(width);

    spectator.component.linksNavigationWidth = '10%';
    spectator.fixture.detectChanges();

    expect(informationsbereich.style.width).toEqual(width);
  });
});

describe('Integration Test: HauptfensterComponent', () => {
  let spectator: Spectator<HauptFensterWrapperComponent>;
  const createComponent = createComponentFactory({
    component: HauptFensterWrapperComponent,
    imports: [HauptfensterModule]
  });

  beforeEach(() => (spectator = createComponent()));

  it('should display custom html in template of Titelzeile', () => {
    const titelzeileEl = spectator.query('.isy-hauptfenster-titelzeile') as HTMLElement;
    const h1El = titelzeileEl.querySelector('.custom-title');
    expect(h1El!.textContent).toEqual('Titel inside H1!');
  });

  it('should not display custom html in Titelzeile if titel input is used', () => {
    const customTitle = 'Custom Title';
    spectator.component.title = customTitle;
    spectator.fixture.detectChanges();
    const titelzeileEl = spectator.query('.isy-hauptfenster-titelzeile') as HTMLElement;
    expect(titelzeileEl.textContent).toEqual(customTitle);
  });
});
