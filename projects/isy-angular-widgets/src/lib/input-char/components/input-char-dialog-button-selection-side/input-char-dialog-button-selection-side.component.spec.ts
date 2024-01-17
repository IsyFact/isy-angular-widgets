import {InputCharDialogButtonSelectionSideComponent} from './input-char-dialog-button-selection-side.component';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {MockModule} from 'ng-mocks';
import {AccordionModule} from 'primeng/accordion';
import {SelectButtonModule} from 'primeng/selectbutton';
import {FormsModule} from '@angular/forms';
import sonderzeichenliste from '../../sonderzeichenliste.json';
import {Zeichenobjekt} from '../../model/model';

let spectator: Spectator<InputCharDialogButtonSelectionSideComponent>;
let component: InputCharDialogButtonSelectionSideComponent;
const sonderzeichenListe = sonderzeichenliste as Zeichenobjekt[];

describe('Unit Tests: InputCharDialogButtonSelectionSideComponent', () => {
  const createComponent = createComponentFactory({
    component: InputCharDialogButtonSelectionSideComponent,
    imports: [MockModule(AccordionModule), MockModule(SelectButtonModule), MockModule(FormsModule)]
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('Integration Tests: InputCharDialogButtonSelectionSideComponent', () => {
  const createComponent = createComponentFactory({
    component: InputCharDialogButtonSelectionSideComponent,
    imports: [SelectButtonModule, AccordionModule, FormsModule]
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
