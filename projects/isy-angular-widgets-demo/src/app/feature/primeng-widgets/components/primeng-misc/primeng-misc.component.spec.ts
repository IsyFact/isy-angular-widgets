import {createComponentFactory, Spectator} from '@ngneat/spectator';

import {PrimengMiscComponent} from './primeng-misc.component';
import {PrimengWidgetsModule} from '../../primeng-widgets.module';
import {storageData} from '../../data/product';

describe('Unit Tests: PrimengMiscComponent', () => {
  let component: PrimengMiscComponent;
  let spectator: Spectator<PrimengMiscComponent>;
  const createComponent = createComponentFactory({
    component: PrimengMiscComponent,
    imports: [PrimengWidgetsModule]
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize storageStatus with storageData', () => {
    expect(component.storageStatus).toEqual(storageData);
  });

  it('should set blockedContent to true on blockContent call', () => {
    component.blockContent();
    expect(component.blockedContent).toBe(true);
  });

  it('should set blockedContent to false on unblockContent call', () => {
    component.unblockContent();
    expect(component.blockedContent).toBe(false);
  });

  it('should unsubscribe from terminalService on ngOnDestroy call', () => {
    const spy = spyOn(component.subscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });
});
