import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {PrimengOverlayComponent} from './primeng-overlay.component';
import {PrimengWidgetsModule} from '../../primeng-widgets.module';

describe('Unit Tests: PrimengOverlayComponent', () => {
  let component: PrimengOverlayComponent;
  let spectator: Spectator<PrimengOverlayComponent>;
  let confirmSpy: jasmine.Spy;
  let messageSpy: jasmine.Spy;

  const createComponent = createComponentFactory({
    component: PrimengOverlayComponent,
    imports: [PrimengWidgetsModule]
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;

    confirmSpy = spyOn(component.confirmationService, 'confirm').and.callThrough();
    messageSpy = spyOn(component.messageService, 'add').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show dialog', () => {
    component.showDialog();
    expect(component.visibleDialog).toBeTrue();
  });

  it('should close dialog', () => {
    component.visibleDialog = true;
    component.closeDialog();
    expect(component.visibleDialog).toBeFalse();
  });

  it('should show sidebar', () => {
    component.showSidebar();
    expect(component.visibleSidebar).toBeTrue();
  });

  it('should open confirm dialog and close it on accept', () => {
    component.confirmDialog({target: {}} as Event);

    expect(confirmSpy).toHaveBeenCalled();

    const confirmArgs = confirmSpy.calls.mostRecent().args[0];
    confirmArgs.accept();

    expect(messageSpy).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Confirmed',
      detail: 'You have accepted'
    });
  });

  it('should open confirm dialog and close it on reject', () => {
    component.confirmDialog({target: {}} as Event);

    expect(confirmSpy).toHaveBeenCalled();

    const confirmArgs = confirmSpy.calls.mostRecent().args[0];
    confirmArgs.reject();

    expect(messageSpy).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Rejected',
      detail: 'You have rejected'
    });
  });

  it('should open confirm popup and close it on accept', () => {
    component.confirmPopup({target: {}} as Event);

    expect(confirmSpy).toHaveBeenCalled();

    const confirmArgs = confirmSpy.calls.mostRecent().args[0];
    confirmArgs.accept();

    expect(messageSpy).toHaveBeenCalledWith({
      severity: 'info',
      summary: 'Confirmed',
      detail: 'You have accepted'
    });
  });

  it('should open confirm popup and close it on reject', () => {
    component.confirmPopup({target: {}} as Event);

    expect(confirmSpy).toHaveBeenCalled();

    const confirmArgs = confirmSpy.calls.mostRecent().args[0];
    confirmArgs.reject();

    expect(messageSpy).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Rejected',
      detail: 'You have rejected'
    });
  });
});
