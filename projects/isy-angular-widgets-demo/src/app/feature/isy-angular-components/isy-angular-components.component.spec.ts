import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {IsyAngularComponentsComponent} from './isy-angular-components.component';
import {TranslateModule} from '@ngx-translate/core';
import {IncompleteDateComponent} from '@isy-angular-widgets/incomplete-date/incomplete-date.component';
import {fakeAsync, tick} from '@angular/core/testing';

describe('IsyAngularComponentsComponent', () => {
  let spectator: Spectator<IsyAngularComponentsComponent>;
  const createComponent = createComponentFactory({
    component: IsyAngularComponentsComponent,
    imports: [TranslateModule.forRoot()]
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should initialize transferDateAsIso8601 with true', () => {
    expect(spectator.component.transferDateAsIso8601).toBeTrue();
  });

  it('should show ISO representation when checkbox is enabled and non-ISO representation when disabled', fakeAsync(() => {
    spectator.component.personalInfoForm.controls.dateOfEntry.setValue('2000-xx-xx');
    spectator.detectChanges();

    expect(spectator.query('small')?.textContent).toContain('2000-xx-xx');

    spectator.component.transferDateAsIso8601 = false;
    spectator.component.personalInfoForm.controls.dateOfEntry.setValue('xx.xx.2000');
    spectator.component.onTransferIso8601Change({
      updateModel: () => {}
    } as IncompleteDateComponent);

    tick();
    spectator.detectChanges();

    expect(spectator.query('small')?.textContent).toContain('xx.xx.2000');
  }));
});
