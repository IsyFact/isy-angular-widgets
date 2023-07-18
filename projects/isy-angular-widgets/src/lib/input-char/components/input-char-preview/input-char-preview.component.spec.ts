import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InputCharPreviewComponent} from './input-char-preview.component';
import {Schriftzeichengruppe, Zeichenobjekt} from '../../model/model';
import {ButtonModule} from 'primeng/button';
import {By} from '@angular/platform-browser';
import { TranslateTestingModule } from 'ngx-translate-testing';

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
        ButtonModule,
        TranslateTestingModule.withTranslations('de', {
          'isyAngularWidgets.inputChar.insert': 'Einfügen'
        })
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

  it('should check the incoming zeichenobjekt input', () => {
    expect(component.zeichenObjekt.zeichen).toEqual(zeichenObjekt.zeichen);
    expect(component.zeichenObjekt.grundzeichen).toEqual(zeichenObjekt.grundzeichen);
    expect(component.zeichenObjekt.schriftzeichengruppe).toEqual(zeichenObjekt.schriftzeichengruppe);
    expect(component.zeichenObjekt.name).toEqual(zeichenObjekt.name);
    expect(component.zeichenObjekt.codepoint).toEqual(zeichenObjekt.codepoint);
  });

  it('should check emitted zeichenobjekt on selection', () => {
    const zeichenObjektChangedSpy = spyOn(component.zeichenObjektChange, 'emit');
    component.selectZeichen(zeichenObjekt);
    expect(zeichenObjektChangedSpy).toHaveBeenCalledWith(zeichenObjekt);
  });

  it('should check the select button label', () => {
    const insertButton = fixture.debugElement.query(By.css('.insert-button')).nativeElement as HTMLElement;
    expect(insertButton.innerText).toContain('Einfügen');
  });

  it('should check the select button click functionality', () => {
    const zeichenObjektChangedSpy = spyOn(component.zeichenObjektChange, 'emit');
    const insertButton = fixture.debugElement.query(By.css('.insert-button')).nativeElement as HTMLElement;
    insertButton.click();
    expect(zeichenObjektChangedSpy).toHaveBeenCalledWith(zeichenObjekt);
  });

  it('should check the character serif information content', () => {
    const serifCharacterPreview = fixture.debugElement.query(By.css('.serif')).nativeElement as HTMLElement;
    expect(serifCharacterPreview.innerText).toContain(zeichenObjekt.zeichen);
  });

  it('should check the character sans-serif information content', () => {
    const sansSerifCharacterPreview = fixture.debugElement.query(By.css('.sans-serif')).nativeElement as HTMLElement;
    expect(sansSerifCharacterPreview.innerText).toContain(zeichenObjekt.zeichen);
  });

  it('should check the character description name', () => {
    const characterDescriptionName = fixture.debugElement.query(By.css('#description')).nativeElement as HTMLElement;
    expect(characterDescriptionName.innerText).toContain(zeichenObjekt.name);
  });

  it('should check the character codepoint', () => {
    const characterDescriptionName = fixture.debugElement.query(By.css('#codepoint')).nativeElement as HTMLElement;
    expect(characterDescriptionName.innerText).toContain(zeichenObjekt.codepoint);
  });
});
