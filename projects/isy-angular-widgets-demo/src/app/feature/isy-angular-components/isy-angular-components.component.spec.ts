import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {IsyAngularComponentsComponent} from './isy-angular-components.component';
import {TranslateModule} from '@ngx-translate/core';
import {IncompleteDateComponent} from '@isy-angular-widgets/incomplete-date/incomplete-date.component';

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

  it('should call updateModel and updateValueAndValidity when transfer mode changes', () => {
    const incompleteDateComponent = jasmine.createSpyObj<IncompleteDateComponent>('IncompleteDateComponent', [
      'updateModel'
    ]);

    const updateValueAndValiditySpy = spyOn(
      spectator.component.personalInfoForm.controls.dateOfEntry,
      'updateValueAndValidity'
    );

    spectator.component.onTransferIso8601Change(incompleteDateComponent);

    expect(incompleteDateComponent.updateModel).toHaveBeenCalled();
    expect(updateValueAndValiditySpy).toHaveBeenCalled();
  });
});
