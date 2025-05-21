import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';
import {PrimengMenuComponent} from './primeng-menu.component';
import {electronicData, megaMenuProductData} from '../../data/product';
import {contextMenuData, fileContainerData, menuBarData, optionData, tabMenuData} from '../../data/file-option';
import {personalData} from '../../data/organization';

describe('Unit Tests: PrimengMenuComponent', () => {
  let component: PrimengMenuComponent;
  let spectator: Spectator<PrimengMenuComponent>;
  const createComponent = createComponentFactory({
    component: PrimengMenuComponent,
    providers: [
      {
        provide: ActivatedRoute,
        useValue: {
          params: of({}),
          snapshot: {
            paramMap: {
              get: (): null => null
            }
          }
        }
      }
    ]
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize electronics with electronicData', () => {
    expect(component.electronics).toEqual(electronicData);
  });

  it('should initialize contextMenuOption with contextMenuData', () => {
    expect(component.contextMenuOption).toEqual(contextMenuData);
  });

  it('should initialize option with optionData', () => {
    expect(component.option).toEqual(optionData);
  });

  it('should initialize menuBarOption with menuBarData', () => {
    expect(component.menuBarOption).toEqual(menuBarData);
  });

  it('should initialize megaMenuOptions with megaMenuProductData', () => {
    expect(component.megaMenuOptions).toEqual(megaMenuProductData);
  });

  it('should initialize fileContainerOptions with fileContainerData', () => {
    expect(component.fileContainerOptions).toEqual(fileContainerData);
  });

  it('should initialize stepItem with personalData', () => {
    expect(component.stepItem).toEqual(personalData);
  });

  it('should initialize tabMenuOption with tabMenuData', () => {
    expect(component.tabMenuOption).toEqual(tabMenuData);
  });

  it('should update activeIndex on onActiveIndexChange call', () => {
    component.onActiveIndexChange(2);
    expect(component.activeIndex).toBe(2);
  });

  it('should have initial activeIndex as 0', () => {
    expect(component.activeIndex).toBe(0);
  });
});
