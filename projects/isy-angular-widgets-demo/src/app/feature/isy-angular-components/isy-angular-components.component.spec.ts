import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {ActivatedRoute} from '@angular/router';
import {ViewportScroller} from '@angular/common';
import {Subject} from 'rxjs';
import {IsyAngularComponentsComponent} from './isy-angular-components.component';
import {TranslateModule} from '@ngx-translate/core';
import {IncompleteDateComponent} from '@isy-angular-widgets/incomplete-date/incomplete-date.component';
import {fakeAsync, tick} from '@angular/core/testing';

describe('IsyAngularComponentsComponent', () => {
  const sectionAnchorIds = ['seitentoolbar', 'formwrapper', 'incompletedate', 'inputchar'];

  let spectator: Spectator<IsyAngularComponentsComponent>;
  const fragment$ = new Subject<string | null>();
  const viewportScrollerMock = {
    scrollToAnchor: jasmine.createSpy('scrollToAnchor')
  };

  const createComponent = createComponentFactory({
    component: IsyAngularComponentsComponent,
    imports: [TranslateModule.forRoot()],
    providers: [
      {provide: ActivatedRoute, useValue: {fragment: fragment$.asObservable()}},
      {provide: ViewportScroller, useValue: viewportScrollerMock}
    ]
  });

  beforeEach(() => {
    viewportScrollerMock.scrollToAnchor.calls.reset();
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should initialize transferDateAsIso8601 with true', () => {
    expect(spectator.component.transferDateAsIso8601).toBeTrue();
  });

  it('should render all section headings with hover-only anchor symbols', () => {
    sectionAnchorIds.forEach((id) => {
      const heading = spectator.query<HTMLHeadingElement>(`h2#${id}`);
      const anchor = spectator.query<HTMLAnchorElement>(`h2#${id} > a.section-anchor`);

      expect(heading).toBeTruthy();
      expect(heading?.classList.contains('section-heading')).toBeTrue();
      expect(anchor).toBeTruthy();
      expect(anchor?.classList.contains('section-anchor')).toBeTrue();
      expect(anchor?.textContent?.trim()).toBe('🔗');
    });
  });

  it('should render all widgets in full-width containers', () => {
    sectionAnchorIds.forEach((id) => {
      const container = spectator.query<HTMLElement>(`.col-12.flex.flex-column.gap-2 h2#${id}`);
      expect(container).toBeTruthy();
    });
  });

  it('should scroll to anchor after initialization when fragment is emitted', () => {
    fragment$.next('formwrapper');
    expect(viewportScrollerMock.scrollToAnchor).toHaveBeenCalledWith('formwrapper');
  });

  it('should scroll to section when anchor symbol is clicked', () => {
    sectionAnchorIds.forEach((id) => {
      viewportScrollerMock.scrollToAnchor.calls.reset();
      spectator.click(`h2#${id} > a`);
      expect(viewportScrollerMock.scrollToAnchor).toHaveBeenCalledWith(id);
    });
  });

  it('should not scroll when clicking only the heading text', () => {
    spectator.click('h2#formwrapper');
    expect(viewportScrollerMock.scrollToAnchor).not.toHaveBeenCalled();
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
