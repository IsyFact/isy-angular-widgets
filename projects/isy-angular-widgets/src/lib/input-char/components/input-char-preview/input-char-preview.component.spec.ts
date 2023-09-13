import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InputCharPreviewComponent} from './input-char-preview.component';
import {Schriftzeichengruppe, Zeichenobjekt} from '../../model/model';
import {ButtonModule} from 'primeng/button';
import {By} from '@angular/platform-browser';

describe('InputCharViewComponent', () => {
  let component: InputCharPreviewComponent;
  let fixture: ComponentFixture<InputCharPreviewComponent>;

  const zeichenObjekt: Zeichenobjekt =   {
    zeichen: 'A',
    grundzeichen: 'A',
    schriftzeichengruppe: Schriftzeichengruppe.LATEIN,
    name: 'LATIN CAPITAL LETTER A',
    codepoint: 'U+0041'
  };

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [
        InputCharPreviewComponent
      ],
      imports: [
        ButtonModule
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(InputCharPreviewComponent);
    component = fixture.componentInstance;
    component.zeichenObjekt = zeichenObjekt;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the selected character in the sans field', () => {
    const serifCharacterPreview = fixture.debugElement.query(By.css('#serif-letter')).nativeElement as HTMLElement;
    expect(serifCharacterPreview.innerText).toContain(zeichenObjekt.zeichen);
  });

  it('should show the selected character sans-serif field', () => {
    const sansSerifCharacterPreview = fixture.debugElement.query(By.css('#sans-letter')).nativeElement as HTMLElement;
    expect(sansSerifCharacterPreview.innerText).toContain(zeichenObjekt.zeichen);
  });

  it('should show selected the character description', () => {
    const characterDescriptionName = fixture.debugElement.query(By.css('#description')).nativeElement as HTMLElement;
    expect(characterDescriptionName.innerText).toContain(zeichenObjekt.name);
  });

  it('should show selected the character codepoint', () => {
    const characterDescriptionName = fixture.debugElement.query(By.css('#codepoint')).nativeElement as HTMLElement;
    expect(characterDescriptionName.innerText).toContain(zeichenObjekt.codepoint);
  });
});
