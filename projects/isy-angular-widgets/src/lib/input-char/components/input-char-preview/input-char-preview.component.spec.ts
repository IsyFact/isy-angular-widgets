import {InputCharPreviewComponent} from './input-char-preview.component';
import {Zeichenobjekt} from '../../model/model';
import {By} from '@angular/platform-browser';
import sonderzeichenliste from '../../sonderzeichenliste.json';
import {createComponentFactory, Spectator} from '@ngneat/spectator';

const sonderzeichenListe = sonderzeichenliste as Zeichenobjekt[];

describe('Unit Tests: InputCharPreviewComponent', () => {
  let component: InputCharPreviewComponent;
  const createComponent = createComponentFactory(InputCharPreviewComponent);
  let spectator: Spectator<InputCharPreviewComponent>;

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  sonderzeichenListe.forEach((zeichenObjekt: Zeichenobjekt) => {
    it(`should show the selected character ${zeichenObjekt.zeichen} in the sans field`, () => {
      component.zeichenObjekt = zeichenObjekt;
      spectator.fixture.detectChanges();

      const serifCharacterPreview = spectator.query('#serif-letter') as HTMLElement;
      expect(serifCharacterPreview.innerText).toContain(zeichenObjekt.zeichen);
    });

    it(`should show the selected character ${zeichenObjekt.zeichen} sans-serif field`, () => {
      component.zeichenObjekt = zeichenObjekt;
      spectator.fixture.detectChanges();

      const sansSerifCharacterPreview = spectator.query('#sans-letter') as HTMLElement;
      expect(sansSerifCharacterPreview.innerText).toContain(zeichenObjekt.zeichen);
    });

    it(`should show selected the character ${zeichenObjekt.zeichen} description`, () => {
      component.zeichenObjekt = zeichenObjekt;
      spectator.fixture.detectChanges();

      const characterDescriptionName = spectator.query('#description') as HTMLElement;
      expect(characterDescriptionName.innerText).toContain(zeichenObjekt.name);
    });

    it(`should show selected the character ${zeichenObjekt.zeichen} codepoint`, () => {
      component.zeichenObjekt = zeichenObjekt;
      spectator.fixture.detectChanges();

      const characterDescriptionName = spectator.query('#codepoint') as HTMLElement;
      expect(characterDescriptionName.innerText).toContain(zeichenObjekt.codepoint);
    });
  });
});
