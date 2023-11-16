import {DialogSachverhalteBearbeitenComponent} from './dialog-sachverhalte-bearbeiten.component';
import {TableModule} from 'primeng/table';
import {createComponentFactory, Spectator} from '@ngneat/spectator';

describe('Integration Tests: DialogSachverhalteBearbeitenComponent', () => {
  let component: DialogSachverhalteBearbeitenComponent;
  let spectator: Spectator<DialogSachverhalteBearbeitenComponent>;
  const createdComponent = createComponentFactory({
    component: DialogSachverhalteBearbeitenComponent,
    imports: [TableModule]
  });

  beforeEach(() => {
    spectator = createdComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnChanges method should have been called', () => {
    const ngOnChangeSpy = spyOn(component, 'ngOnChanges').and.callThrough();
    component.ngOnChanges();
    expect(ngOnChangeSpy).toHaveBeenCalled();
  });

  it('saveSachverhalte method should have been called', () => {
    const saveSachverhalteSpy = spyOn(component, 'saveSachverhalte').and.callThrough();
    component.saveSachverhalte();
    expect(saveSachverhalteSpy).toHaveBeenCalled();
  });

  it('createSachverhalt method should have been called', () => {
    const spy = spyOn(component, 'createSachverhalt').and.callThrough();
    component.createSachverhalt('createSachverhalt');
    expect(spy).toHaveBeenCalled();
  });

  it('deleteSachverhalt method should have been called', () => {
    const spy = spyOn(component, 'deleteSachverhalt').and.callThrough();
    component.deleteSachverhalt('deleteSachverhalt');
    expect(spy).toHaveBeenCalled();
  });

  it('closeDialog method should have been called', () => {
    const spy = spyOn(component, 'closeDialog').and.callThrough();
    component.closeDialog();
    expect(spy).toHaveBeenCalled();
  });
});
