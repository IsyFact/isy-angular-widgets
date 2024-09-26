import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {ConfirmPopup} from 'primeng/confirmpopup';
import {By} from '@angular/platform-browser';

import {PrimengOverlayComponent} from './primeng-overlay.component';
import {PrimengWidgetsModule} from '../../primeng-widgets.module';

describe('Unit Tests: PrimengOverlayComponent', () => {
  let component: PrimengOverlayComponent;
  let spectator: Spectator<PrimengOverlayComponent>;

  let confirmDialog: ConfirmDialog;
  let confirmPopup: ConfirmPopup;

  const createComponent = createComponentFactory({
    component: PrimengOverlayComponent,
    imports: [PrimengWidgetsModule]
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
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
    confirmDialog = spectator.debugElement.query(By.css('p-confirmDialog')).componentInstance;

    const openDialog = spyOn(confirmDialog, 'accept').and.callThrough();
    component.confirmDialog(new Event(''));

    spectator.detectChanges();

    const acceptButton = spectator.debugElement.query(By.css('.p-confirm-dialog-accept')).nativeElement;
    acceptButton.click();

    spectator.detectChanges();

    expect(openDialog).toHaveBeenCalled();
  });

  it('should open confirm dialog and close it on reject', () => {
    confirmDialog = spectator.debugElement.query(By.css('p-confirmDialog')).componentInstance;

    const openDialog = spyOn(confirmDialog, 'reject').and.callThrough();
    component.confirmDialog(new Event(''));

    spectator.detectChanges();

    const rejectButton = spectator.debugElement.query(By.css('.p-confirm-dialog-reject')).nativeElement;
    rejectButton.click();

    spectator.detectChanges();

    expect(openDialog).toHaveBeenCalled();
  });
});
