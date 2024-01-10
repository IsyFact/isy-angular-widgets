import {PageNotFoundComponent} from './page-not-found.component';
import {createComponentFactory, Spectator} from '@ngneat/spectator';

describe('Unit Tests: PageNotFoundComponent', () => {
  const startPage = 'Startseite';
  let spectator: Spectator<PageNotFoundComponent>;
  const createComponent = createComponentFactory(PageNotFoundComponent);

  beforeEach(() => (spectator = createComponent()));

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it(`should have ${startPage} as inner text value`, () => {
    const anchorTag = spectator.query('a') as HTMLAnchorElement;
    expect(anchorTag.innerText).toEqual(startPage);
  });
});
