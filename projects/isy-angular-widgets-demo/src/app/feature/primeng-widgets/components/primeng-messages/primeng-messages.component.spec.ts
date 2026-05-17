import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {ActivatedRoute} from '@angular/router';
import {ViewportScroller} from '@angular/common';
import {Subject} from 'rxjs';
import {MessageService} from 'primeng/api';
import {PrimengMessagesComponent} from './primeng-messages.component';
import {messageData} from '../../data/file-option';

describe('Unit Tests: PrimengMessagesComponent', () => {
  const sectionAnchorIds = ['messages', 'toast'];

  let component: PrimengMessagesComponent;
  let spectator: Spectator<PrimengMessagesComponent>;
  const fragment$ = new Subject<string | null>();
  const viewportScrollerMock = {
    scrollToAnchor: jasmine.createSpy('scrollToAnchor')
  };

  const createComponent = createComponentFactory({
    component: PrimengMessagesComponent,
    providers: [
      MessageService,
      {provide: ActivatedRoute, useValue: {fragment: fragment$.asObservable()}},
      {provide: ViewportScroller, useValue: viewportScrollerMock}
    ]
  });

  beforeEach(() => {
    viewportScrollerMock.scrollToAnchor.calls.reset();
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize messages with messageData', () => {
    expect(component.messages).toEqual(messageData);
  });

  it('should render section headings with hover-only anchor symbols', () => {
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

  it('should render all sections in full-width containers', () => {
    const fullWidthContainers = spectator.queryAll<HTMLElement>('.col-12.flex.flex-column.gap-2');

    expect(fullWidthContainers.length).toBeGreaterThanOrEqual(sectionAnchorIds.length);
    sectionAnchorIds.forEach((id) => {
      const container = spectator.query<HTMLElement>(`.col-12.flex.flex-column.gap-2 h2#${id}`);
      expect(container).toBeTruthy();
    });
  });

  it('should scroll to anchor after initialization when fragment is emitted', () => {
    fragment$.next('messages');
    expect(viewportScrollerMock.scrollToAnchor).toHaveBeenCalledWith('messages');
  });

  it('should scroll to section when anchor symbol is clicked', () => {
    sectionAnchorIds.forEach((id) => {
      viewportScrollerMock.scrollToAnchor.calls.reset();

      spectator.click(`h2#${id} > a`);
      expect(viewportScrollerMock.scrollToAnchor).toHaveBeenCalledWith(id);
    });
  });

  it('should not scroll when clicking only the heading text', () => {
    spectator.click('h2#messages');
    expect(viewportScrollerMock.scrollToAnchor).not.toHaveBeenCalled();
  });

  it('should add a success toast message on showToastMessage call', () => {
    const spy = spyOn(component.messageService, 'add');
    component.showToastMessage();
    expect(spy).toHaveBeenCalledWith({
      key: 'toast',
      severity: 'success',
      summary: 'Success',
      detail: 'Message Content',
      sticky: true
    });
  });
});
