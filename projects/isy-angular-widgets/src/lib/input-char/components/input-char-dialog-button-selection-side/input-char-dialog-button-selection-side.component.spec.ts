import {InputCharDialogButtonSelectionSideComponent} from './input-char-dialog-button-selection-side.component';
import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {MockModule} from 'ng-mocks';
import {AccordionModule} from 'primeng/accordion';
import {SelectButtonModule} from 'primeng/selectbutton';
import {FormsModule} from '@angular/forms';
import sonderzeichenliste from '../../sonderzeichenliste.json';
import {InputCharData, Zeichenobjekt} from '../../model/model';

let spectator: Spectator<InputCharDialogButtonSelectionSideComponent>;
let component: InputCharDialogButtonSelectionSideComponent;

const charList = sonderzeichenliste as Zeichenobjekt[];
const bases = [...new Set(charList.map((item) => (item.grundzeichen === '' ? '*' : item.grundzeichen)))];
const groups = [...new Set(charList.map((item) => item.schriftzeichengruppe))];

const headerStr = 'Alle';
const inputData: InputCharData[] = [{Basis: bases}, {Gruppen: groups}];

/**
 * Adds a click event listener to the given button
 * @param button The button who needs an event
 * @param event Event who must be
 * @param param Zeichen method parameter
 */
function addClickEventListenerForSelection(button: HTMLButtonElement, event: string, param: string): void {
  button.addEventListener(event, function () {
    spectator.component.onSelection(param);
  });
}

describe('Unit Tests: InputCharDialogButtonSelectionSideComponent', () => {
  const createComponent = createComponentFactory({
    component: InputCharDialogButtonSelectionSideComponent,
    imports: [MockModule(AccordionModule), MockModule(SelectButtonModule), MockModule(FormsModule)]
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        dataToDisplay: inputData,
        allButtonOptions: headerStr
      }
    });
    component = spectator.component;
    spectator.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('all select button should have the correct option value', () => {
    const allSelectButton = spectator.query('#all-select-button') as HTMLButtonElement;
    const allSelectButtonAttributes = allSelectButton.attributes;

    const allSelectButtonInnerText = allSelectButtonAttributes.getNamedItem('ng-reflect-options')?.textContent;
    expect(allSelectButtonInnerText).toEqual(headerStr);
  });

  it('should firing event on all button click', () => {
    const spy = spyOn(component, 'onSelection');
    const allSelectButton = spectator.query('#all-select-button') as HTMLButtonElement;
    const eventType = 'onChange';

    addClickEventListenerForSelection(allSelectButton, eventType, '');
    allSelectButton.dispatchEvent(new Event(eventType));
    spectator.detectChanges();

    expect(spy).toHaveBeenCalledWith('');
  });
});

fdescribe('Integration Tests: InputCharDialogButtonSelectionSideComponent', () => {
  const createComponent = createComponentFactory({
    component: InputCharDialogButtonSelectionSideComponent,
    imports: [SelectButtonModule, AccordionModule, FormsModule]
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        dataToDisplay: inputData,
        allButtonOptions: headerStr
      }
    });
    component = spectator.component;
    spectator.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
