import {ComponentFixture, TestBed} from '@angular/core/testing';

import {HauptfensterComponent} from './hauptfenster.component';
import {MegaMenuModule} from 'primeng/megamenu';
import {ButtonModule} from 'primeng/button';
import {Component, Input, NO_ERRORS_SCHEMA} from '@angular/core';

@Component({
  template: `
    <isy-hauptfenster [title]="title">
      <div Titelzeile>
        <h1 class="custom-title">Titel inside H1!</h1>
      </div>
    </isy-hauptfenster>
`})
class HauptFensterWrapperComponent {
  @Input() title!: string;
}

describe('Unit Tests: HauptfensterComponent', ()=> {
  let component: HauptfensterComponent;
  let fixture: ComponentFixture<HauptfensterComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [
        HauptfensterComponent
      ],
      schemas:[
        NO_ERRORS_SCHEMA
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HauptfensterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title input in Titelzeile', () => {
    const customTitle = 'Custom Title';
    component.title = customTitle;
    fixture.detectChanges();
    const titelzeileEl = fixture.nativeElement.querySelector('.isy-hauptfenster-titelzeile') as HTMLElement;

    expect(titelzeileEl.textContent).toEqual(customTitle);
  });

  it('should show "Abmelden" as the title of the logout button', () => {
    const logoutTitle = 'Abmelden';
    const logoutButton = fixture.nativeElement.querySelector('#isy-hauptfenster-logout-button') as HTMLButtonElement;
    const logoutButtonText = logoutButton.textContent ?? '';
    expect(logoutButtonText.trim()).toEqual(logoutTitle);
  });

  it('should call the logout function when the button is clocked', () => {
    const spy = spyOn(component.logoutEvent, 'emit');
    const logoutButton = fixture.nativeElement.querySelector('#isy-hauptfenster-logout-button') as HTMLButtonElement;
    logoutButton.click();
    expect(spy).toHaveBeenCalledWith(component.userInfo);
  });

  it('should have a hidden linksnavigation by default', () => {
    const linksnavigation = fixture.nativeElement.querySelector('.isy-hauptfenster-linksnavigation') as HTMLElement;
    expect(linksnavigation).toBeFalsy();
  });

  it('should have a hidden informationsbereich by default', () => {
    const informationsbereich = fixture.nativeElement.querySelector('.isy-hauptfenster-informationsbereich') as HTMLElement;
    expect(informationsbereich).toBeFalsy();
  });

  it('should use the provided Linksnavigation width', () => {
    const customLinksnavigationWidth = '5em';
    component.linksNavigationWidth = customLinksnavigationWidth;
    component.showLinksnavigation = true;
    fixture.detectChanges();
    const linksnavigation = fixture.nativeElement.querySelector('#open-links-navigation') as HTMLElement;
    expect(linksnavigation.style.width).toEqual(customLinksnavigationWidth);
  });

  it('should use the provided Informationsbereich width', () => {
    const customInformationsbereichWidth = '5em';
    component.informationsbereichWidth = customInformationsbereichWidth;
    component.showInformationsbereich = true;
    fixture.detectChanges();
    const informationsbereich = fixture.nativeElement.querySelector('#open-informationsbereich') as HTMLElement;
    expect(informationsbereich.style.width).toEqual(customInformationsbereichWidth);
  });
});

describe('Integration Test: HauptfensterComponent', () => {
  let component: HauptfensterComponent;
  let fixture: ComponentFixture<HauptfensterComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [
        HauptfensterComponent,
        HauptFensterWrapperComponent
      ],
      imports: [
        MegaMenuModule,
        ButtonModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HauptfensterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display custom html in template of Titelzeile', () => {
    const wrapperFixture = TestBed.createComponent(HauptFensterWrapperComponent);
    wrapperFixture.detectChanges();
    const titelzeileEl = wrapperFixture.nativeElement.querySelector('.isy-hauptfenster-titelzeile') as HTMLElement;
    const h1El = titelzeileEl.querySelector('.custom-title');

    expect(h1El!.textContent).toEqual('Titel inside H1!');
  });

  it('should not display custom html in Titelzeile if titel input is used', () => {
    const wrapperFixture = TestBed.createComponent(HauptFensterWrapperComponent);
    const wrapperComponent = wrapperFixture.componentInstance;
    const customTitle = 'Custom Title';
    wrapperComponent.title = customTitle;
    wrapperFixture.detectChanges();
    const titelzeileEl = wrapperFixture.nativeElement.querySelector('.isy-hauptfenster-titelzeile') as HTMLElement;
    expect(titelzeileEl.textContent).toEqual(customTitle);
  });
});
