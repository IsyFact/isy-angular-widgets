import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InputCharPreviewCharListComponent} from './input-char-preview-char-list.component';
import {SelectButtonModule} from 'primeng/selectbutton';
import {FormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {Zeichenobjekt} from '../../model/model';
import sonderzeichenliste from '../../sonderzeichenliste.json';

describe('InputCharPreviewCharListComponent', () => {
  let component: InputCharPreviewCharListComponent;
  let fixture: ComponentFixture<InputCharPreviewCharListComponent>;

  const options = sonderzeichenliste as Zeichenobjekt[];

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [InputCharPreviewCharListComponent],
      imports: [
        SelectButtonModule,
        FormsModule,
        ButtonModule
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(InputCharPreviewCharListComponent);
    component = fixture.componentInstance;
    component.options = options;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check the selected value on Init', () => {
    expect(component.selectedValue).toBeUndefined();
  });

  it('should check the zeichenobjekt selection', () => {
    const zeichenObjekt = options[0];
    const charSelection = spyOn(component.charSelection, 'emit');

    component.onSelection(zeichenObjekt);
    expect(component.selectedValue).toEqual(zeichenObjekt);
    expect(charSelection).toHaveBeenCalledWith(zeichenObjekt);
  });

  it('should check the reset functionality', () => {
    const zeichenObjekt = options[0];
    const charSelection = spyOn(component.charSelection, 'emit');

    component.reset();
    expect(component.selectedValue).toEqual(zeichenObjekt);
    expect(charSelection).toHaveBeenCalledWith(zeichenObjekt);
  });

  it('should check the character buttons html inner content', () => {
    const characterSelectButtons = fixture.nativeElement.querySelectorAll('.char-select-button') as HTMLElement [];
    expect(characterSelectButtons.length).toEqual(options.length);

    for (let i = 0; i < options.length; i++) {
      const currentSelectButton = characterSelectButtons[i];
      if (currentSelectButton.innerText !== '') {
        expect(currentSelectButton.innerText).toEqual(options[i].zeichen);
      }
    }
  });

  it('should check the character buttons click functionality', () => {
    const charSelection = spyOn(component.charSelection, 'emit');

    const characterSelectButtons = fixture.nativeElement.querySelectorAll('.char-select-button') as HTMLElement [];
    expect(characterSelectButtons.length).toEqual(options.length);

    const crypto = window.crypto;
    const randomIndex =  (crypto.getRandomValues(new Uint32Array(1)))[0]%options.length;

    characterSelectButtons[randomIndex].click();

    expect(component.selectedValue.toString()).toEqual(options[randomIndex].zeichen);
    expect(charSelection).toHaveBeenCalledWith(options[randomIndex]);
  });
});
