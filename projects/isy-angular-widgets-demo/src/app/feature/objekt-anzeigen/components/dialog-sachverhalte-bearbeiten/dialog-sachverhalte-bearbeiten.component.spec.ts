import {DialogSachverhalteBearbeitenComponent} from './dialog-sachverhalte-bearbeiten.component';
import {TableModule} from 'primeng/table';
import {createComponentFactory, Spectator} from '@ngneat/spectator';

describe('Integration Tests: DialogSachverhalteBearbeitenComponent', () => {
  let spectator: Spectator<DialogSachverhalteBearbeitenComponent>;
  const createdComponent = createComponentFactory({
    component: DialogSachverhalteBearbeitenComponent,
    imports: [TableModule]
  });

  beforeEach(() => (spectator = createdComponent()));

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('ngOnChanges method should have been called', () => {
    const ngOnChangeSpy = spyOn(spectator.component, 'ngOnChanges').and.callThrough();
    spectator.component.ngOnChanges();
    expect(ngOnChangeSpy).toHaveBeenCalled();
  });

  it('saveSachverhalte method should have been called', () => {
    const saveSachverhalteSpy = spyOn(spectator.component, 'saveSachverhalte').and.callThrough();
    spectator.component.saveSachverhalte();
    expect(saveSachverhalteSpy).toHaveBeenCalled();
  });

  it('createSachverhalt method should have been called', () => {
    const spy = spyOn(spectator.component, 'createSachverhalt').and.callThrough();
    spectator.component.createSachverhalt('createSachverhalt');
    expect(spy).toHaveBeenCalled();
  });

  it('deleteSachverhalt method should have been called', () => {
    const spy = spyOn(spectator.component, 'deleteSachverhalt').and.callThrough();
    spectator.component.deleteSachverhalt('deleteSachverhalt');
    expect(spy).toHaveBeenCalled();
  });

  it('closeDialog method should have been called', () => {
    const spy = spyOn(spectator.component, 'closeDialog').and.callThrough();
    spectator.component.closeDialog();
    expect(spy).toHaveBeenCalled();
  });
});
