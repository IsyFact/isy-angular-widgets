import {ComponentFixture, TestBed} from '@angular/core/testing';

import {HauptfensterComponent} from './hauptfenster.component';
import {MegaMenuModule} from 'primeng/megamenu';
import {ButtonModule} from 'primeng/button';
import {Component, Input, ViewChild} from '@angular/core';

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// Usage for accessing native HTML Elements
@Component({
  template: `
    <isy-hauptfenster [title]="title">
      <div Titelzeile>
        <h1 class="custom-title">Titel inside H1!</h1>
      </div>
    </isy-hauptfenster>
`})
class HauptFensterWrapperComponent {
  @ViewChild('hauptfenster') hauptfenster!: HauptfensterComponent;
  @Input() title!: string;
}

describe('HauptfensterComponent', () => {
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('display title input in Titelzeile', () => {
    const customTitle = 'Custom Title';
    component.title = customTitle;
    fixture.detectChanges();
    const titelzeileEl = fixture.nativeElement.querySelector('.isy-hauptfenster-titelzeile') as HTMLElement;

    expect(titelzeileEl.textContent).toEqual(customTitle);
  });

  it('display custom html in template of Titelzeile', () => {
    const wrapperFixture = TestBed.createComponent(HauptFensterWrapperComponent);
    wrapperFixture.detectChanges();
    const titelzeileEl = wrapperFixture.nativeElement.querySelector('.isy-hauptfenster-titelzeile') as HTMLElement;
    const h1El = titelzeileEl.querySelector('.custom-title');

    expect(h1El!.textContent).toEqual('Titel inside H1!');
  });

  it('does not display custom html in Titelzeile if titel input is used', () => {
    const wrapperFixture = TestBed.createComponent(HauptFensterWrapperComponent);
    const wrapperComponent = wrapperFixture.componentInstance;
    const customTitle = 'Custom Title';
    wrapperComponent.title = customTitle;
    wrapperFixture.detectChanges();
    const titelzeileEl = wrapperFixture.nativeElement.querySelector('.isy-hauptfenster-titelzeile') as HTMLElement;
    expect(titelzeileEl.textContent).toEqual(customTitle);
  });

  it('expect caption of the logout button is equal "Abmelden"', () => {
    const logoutTitle = 'Abmelden';
    const logoutButton = fixture.nativeElement.querySelector('#isy-hauptfenster-logout-button') as HTMLButtonElement;
    expect(logoutButton.textContent).toEqual(logoutTitle);
  });

  it('should check the logout function to have been called', () => {
    const spy = spyOn(component.logoutEvent, 'emit');
    const logoutButton = fixture.nativeElement.querySelector('#isy-hauptfenster-logout-button') as HTMLButtonElement;
    logoutButton.click();
    expect(spy).toHaveBeenCalledWith(component.userInfo);
  });

  it('expect the linksnavigation to be hidden', () => {
    const linksnavigation = fixture.nativeElement.querySelector('.isy-hauptfenster-linksnavigation') as HTMLElement;
    expect(linksnavigation.attributes.getNamedItem('hidden')).toBeTruthy();
  });

  it('expect the informationsbereich to be hidden', () => {
    const informationsbereich = fixture.nativeElement.querySelector('.isy-hauptfenster-informationsbereich') as HTMLElement;
    expect(informationsbereich.attributes.getNamedItem('hidden')).toBeTruthy();
  });
});
