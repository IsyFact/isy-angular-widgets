import {InputCharPreviewComponent} from './input-char-preview.component';
import {Zeichenobjekt} from '../../model/model';
import sonderzeichenliste from '../../sonderzeichenliste.json';
import {createComponentFactory, Spectator} from '@ngneat/spectator';

describe('Unit Tests: InputCharPreviewComponent', () => {
  const sonderzeichenListe = sonderzeichenliste as Zeichenobjekt[];
  let spectator: Spectator<InputCharPreviewComponent>;

  const createComponent = createComponentFactory({
    component: InputCharPreviewComponent
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  sonderzeichenListe.forEach((zeichenObjekt: Zeichenobjekt) => {
    it(`should show the selected character ${zeichenObjekt.zeichen} in the serif and sans serif font`, () => {
      spectator.setInput('zeichenObjekt', zeichenObjekt);
      spectator.detectChanges();

      const serifCharacterPreview = spectator.query('#serif-letter') as HTMLElement;
      expect(serifCharacterPreview.innerText).toContain(zeichenObjekt.zeichen);

      const sansSerifCharacterPreview = spectator.query('#sans-letter') as HTMLElement;
      expect(sansSerifCharacterPreview.innerText).toContain(zeichenObjekt.zeichen);
    });

    it(`should show selected the character ${zeichenObjekt.zeichen} description`, () => {
      spectator.setInput('zeichenObjekt', zeichenObjekt);
      spectator.detectChanges();

      const characterDescriptionName = spectator.query('#description') as HTMLElement;
      expect(characterDescriptionName.innerText).toContain(zeichenObjekt.name);
    });

    it(`should show selected the character ${zeichenObjekt.zeichen} codepoint`, () => {
      spectator.setInput('zeichenObjekt', zeichenObjekt);
      spectator.detectChanges();

      const characterDescriptionName = spectator.query('#codepoint') as HTMLElement;
      expect(characterDescriptionName.innerText).toContain(zeichenObjekt.codepoint);
    });

    it(`should have aria-label for letters preview with character ${zeichenObjekt.zeichen}`, () => {
      spectator.setInput('zeichenObjekt', zeichenObjekt);
      spectator.detectChanges();

      const lettersPreview = spectator.query('#letters-preview') as HTMLElement;
      expect(lettersPreview.getAttribute('aria-label')).toBe(`Zeichenvorschau: ${zeichenObjekt.zeichen}`);
    });

    it(`should have aria-label for letter information preview with character ${zeichenObjekt.zeichen}`, () => {
      spectator.setInput('zeichenObjekt', zeichenObjekt);
      spectator.detectChanges();

      const letterInfoPreview = spectator.query('#letter-information-preview') as HTMLElement;
      expect(letterInfoPreview.getAttribute('aria-label')).toBe(
        `Zeicheninformationen: ${zeichenObjekt.name}, Codepoint: ${zeichenObjekt.codepoint}`
      );
    });
  });

  it('should have default aria-labels when no character is selected', () => {
    spectator.setInput('zeichenObjekt', undefined);
    spectator.detectChanges();

    const lettersPreview = spectator.query('#letters-preview') as HTMLElement;
    expect(lettersPreview.getAttribute('aria-label')).toBe('Zeichenvorschau');

    const letterInfoPreview = spectator.query('#letter-information-preview') as HTMLElement;
    expect(letterInfoPreview.getAttribute('aria-label')).toBe('Zeicheninformationen');
  });
});
