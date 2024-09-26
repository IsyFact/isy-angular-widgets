import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {IsyAngularComponentsComponent} from './isy-angular-components.component';
import {TranslateModule} from '@ngx-translate/core';

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
});
