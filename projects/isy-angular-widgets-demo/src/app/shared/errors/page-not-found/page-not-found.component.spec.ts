import {PageNotFoundComponent} from './page-not-found.component';
import {By} from '@angular/platform-browser';
import {createComponentFactory, Spectator} from '@ngneat/spectator';

describe('Unit Tests: PageNotFoundComponent', () => {
  const startPage = 'Startseite';
  let spectator: Spectator<PageNotFoundComponent>;
  const createdComponent = createComponentFactory(PageNotFoundComponent);

  beforeEach(() => (spectator = createdComponent()));

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it(`should have ${startPage} as inner text value`, () => {
    const anchorTag = spectator.query('a') as HTMLAnchorElement;
    expect(anchorTag.innerText).toEqual(startPage);
  });
});
