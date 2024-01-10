import {InputCharPreviewComponent} from './input-char-preview.component';
import {Zeichenobjekt} from '../../model/model';
import sonderzeichenliste from '../../sonderzeichenliste.json';
import {createComponentFactory, Spectator} from '@ngneat/spectator';

<<<<<<< HEAD
const sonderzeichenListe = sonderzeichenliste as Zeichenobjekt[];

describe('Unit Tests: InputCharPreviewComponent', () => {
  let component: InputCharPreviewComponent;
  let spectator: Spectator<InputCharPreviewComponent>;
  const createComponent = createComponentFactory(InputCharPreviewComponent);

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });
=======
describe('Unit Tests: InputCharPreviewComponent', () => {
  const sonderzeichenListe = sonderzeichenliste as Zeichenobjekt[];
  let spectator: Spectator<InputCharPreviewComponent>;
  const createComponent = createComponentFactory(InputCharPreviewComponent);

  beforeEach(() => (spectator = createComponent()));
>>>>>>> origin

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  sonderzeichenListe.forEach((zeichenObjekt: Zeichenobjekt) => {
<<<<<<< HEAD
    it(`should show the selected character ${zeichenObjekt.zeichen} in the sans field`, () => {
      component.zeichenObjekt = zeichenObjekt;
=======
    it(`should show the selected character ${zeichenObjekt.zeichen} in the serif and sans serif font`, () => {
      spectator.component.zeichenObjekt = zeichenObjekt;
>>>>>>> origin
      spectator.fixture.detectChanges();

      const serifCharacterPreview = spectator.query('#serif-letter') as HTMLElement;
      expect(serifCharacterPreview.innerText).toContain(zeichenObjekt.zeichen);

<<<<<<< HEAD
    it(`should show the selected character ${zeichenObjekt.zeichen} sans-serif field`, () => {
      component.zeichenObjekt = zeichenObjekt;
      spectator.fixture.detectChanges();

=======
>>>>>>> origin
      const sansSerifCharacterPreview = spectator.query('#sans-letter') as HTMLElement;
      expect(sansSerifCharacterPreview.innerText).toContain(zeichenObjekt.zeichen);
    });

    it(`should show selected the character ${zeichenObjekt.zeichen} description`, () => {
<<<<<<< HEAD
      component.zeichenObjekt = zeichenObjekt;
=======
      spectator.component.zeichenObjekt = zeichenObjekt;
>>>>>>> origin
      spectator.fixture.detectChanges();

      const characterDescriptionName = spectator.query('#description') as HTMLElement;
      expect(characterDescriptionName.innerText).toContain(zeichenObjekt.name);
    });

    it(`should show selected the character ${zeichenObjekt.zeichen} codepoint`, () => {
<<<<<<< HEAD
      component.zeichenObjekt = zeichenObjekt;
=======
      spectator.component.zeichenObjekt = zeichenObjekt;
>>>>>>> origin
      spectator.fixture.detectChanges();

      const characterDescriptionName = spectator.query('#codepoint') as HTMLElement;
      expect(characterDescriptionName.innerText).toContain(zeichenObjekt.codepoint);
    });
  });
});
