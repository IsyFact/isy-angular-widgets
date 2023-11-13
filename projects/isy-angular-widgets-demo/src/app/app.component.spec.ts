import {AppComponent} from './app.component';
import {AppModule} from './app.module';
import {createComponentFactory, Spectator} from '@ngneat/spectator';

describe('Integration Tests: AppComponent', () => {
  let spectator: Spectator<AppComponent>;
  const createdComponent = createComponentFactory({
    component: AppComponent,
    imports: [AppModule]
  });

  beforeEach(() => (spectator = createdComponent()));

  it('should create the application', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should display the user name', () => {
    expect(spectator.component.userInfo?.displayName).toEqual('Max Mustermann');
  });

  it('the hauptfenster component should not be null', () => {
    const hauptfenster = spectator.fixture.nativeElement.querySelector('isy-hauptfenster') as HTMLElement;
    expect(hauptfenster).not.toBeNull();
  });
});
