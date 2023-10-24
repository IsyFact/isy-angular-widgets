import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InputCharPreviewComponent} from './input-char-preview.component';
import {Zeichenobjekt} from '../../model/model';
import {By} from '@angular/platform-browser';
import sonderzeichenliste from '../../sonderzeichenliste.json';
import {NO_ERRORS_SCHEMA} from '@angular/core';

describe('Unit Tests: InputCharViewComponent', () => {
  let component: InputCharPreviewComponent;
  let fixture: ComponentFixture<InputCharPreviewComponent>;
  const sonderzeichenListe = sonderzeichenliste as Zeichenobjekt[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputCharPreviewComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(InputCharPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  sonderzeichenListe.forEach((zeichenObjekt: Zeichenobjekt) => {
    it(`should show the selected character ${zeichenObjekt.zeichen} in the sans field`, () => {
      component.zeichenObjekt = zeichenObjekt;
      fixture.detectChanges();

      const serifCharacterPreview = fixture.debugElement.query(By.css('#serif-letter')).nativeElement as HTMLElement;
      expect(serifCharacterPreview.innerText).toContain(zeichenObjekt.zeichen);
    });

    it(`should show the selected character ${zeichenObjekt.zeichen} sans-serif field`, () => {
      component.zeichenObjekt = zeichenObjekt;
      fixture.detectChanges();

      const sansSerifCharacterPreview = fixture.debugElement.query(By.css('#sans-letter')).nativeElement as HTMLElement;
      expect(sansSerifCharacterPreview.innerText).toContain(zeichenObjekt.zeichen);
    });

    it(`should show selected the character ${zeichenObjekt.zeichen} description`, () => {
      component.zeichenObjekt = zeichenObjekt;
      fixture.detectChanges();

      const characterDescriptionName = fixture.debugElement.query(By.css('#description')).nativeElement as HTMLElement;
      expect(characterDescriptionName.innerText).toContain(zeichenObjekt.name);
    });

    it(`should show selected the character ${zeichenObjekt.zeichen} codepoint`, () => {
      component.zeichenObjekt = zeichenObjekt;
      fixture.detectChanges();

      const characterDescriptionName = fixture.debugElement.query(By.css('#codepoint')).nativeElement as HTMLElement;
      expect(characterDescriptionName.innerText).toContain(zeichenObjekt.codepoint);
    });
  });
});
