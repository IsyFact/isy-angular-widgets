import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {ActivatedRoute} from '@angular/router';
import {ViewportScroller} from '@angular/common';
import {Subject} from 'rxjs';
import {PrimengOverlayComponent} from './primeng-overlay.component';

describe('Unit Tests: PrimengOverlayComponent', () => {
  const sectionAnchorIds = ['sidebar', 'dialog', 'confirmdialog', 'confirmpopup', 'tooltip', 'overlaypanel'];

  let component: PrimengOverlayComponent;
  let spectator: Spectator<PrimengOverlayComponent>;
  let confirmSpy: jasmine.Spy;
  let messageSpy: jasmine.Spy;

  const fragment$ = new Subject<string | null>();
  const viewportScrollerMock = {
    scrollToAnchor: jasmine.createSpy('scrollToAnchor')
  };

  const createComponent = createComponentFactory({
    component: PrimengOverlayComponent,
    providers: [
      {provide: ActivatedRoute, useValue: {fragment: fragment$.asObservable()}},
      {provide: ViewportScroller, useValue: viewportScrollerMock}
    ]
  });

  const createClickEvent = (element: HTMLElement): Event =>
    ({
      currentTarget: element,
      target: element
    }) as unknown as Event;

  beforeEach(() => {
    viewportScrollerMock.scrollToAnchor.calls.reset();
    spectator = createComponent();
    component = spectator.component;

    confirmSpy = spyOn(component.confirmationService, 'confirm').and.callThrough();
    messageSpy = spyOn(component.messageService, 'add').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all section headings with hover-only anchor symbols', () => {
    sectionAnchorIds.forEach((id) => {
      const heading = spectator.query<HTMLHeadingElement>(`h3#${id}`);
      const anchor = spectator.query<HTMLAnchorElement>(`h3#${id} > a.section-anchor`);

      expect(heading).toBeTruthy();
      expect(heading?.classList.contains('section-heading')).toBeTrue();
      expect(anchor).toBeTruthy();
      expect(anchor?.classList.contains('section-anchor')).toBeTrue();
      expect(anchor?.textContent?.trim()).toBe('🔗');
    });
  });

  it('should render all widgets in full-width containers', () => {
    sectionAnchorIds.forEach((id) => {
      const container = spectator.query<HTMLElement>(`.col-12.flex.flex-column.gap-2 h3#${id}`);
      expect(container).toBeTruthy();
    });
  });

  it('should scroll to anchor after initialization when fragment is emitted', () => {
    fragment$.next('dialog');
    expect(viewportScrollerMock.scrollToAnchor).toHaveBeenCalledWith('dialog');
  });

  it('should scroll to section when anchor symbol is clicked', () => {
    sectionAnchorIds.forEach((id) => {
      viewportScrollerMock.scrollToAnchor.calls.reset();
      spectator.click(`h3#${id} > a`);
      expect(viewportScrollerMock.scrollToAnchor).toHaveBeenCalledWith(id);
    });
  });

  it('should not scroll when clicking only the heading text', () => {
    spectator.click('h3#dialog');
    expect(viewportScrollerMock.scrollToAnchor).not.toHaveBeenCalled();
  });

  it('should show dialog', () => {
    const button = document.createElement('button');
    component.showDialog(createClickEvent(button));
    expect(component.visibleDialog).toBeTrue();
  });

  it('should close dialog', () => {
    component.visibleDialog = true;
    component.closeDialog();
    expect(component.visibleDialog).toBeFalse();
  });

  it('should show sidebar', () => {
    const button = document.createElement('button');
    component.showSidebar(createClickEvent(button));
    expect(component.visibleSidebar).toBeTrue();
  });

  it('should restore focus to dialog trigger when dialog hides', async () => {
    const button = document.createElement('button');
    document.body.appendChild(button);

    try {
      const focusSpy = spyOn(button, 'focus');

      component.showDialog(createClickEvent(button));
      spectator.detectChanges();

      component.onDialogHide();
      spectator.detectChanges();
      await spectator.fixture.whenStable();
      spectator.detectChanges();

      expect(focusSpy).toHaveBeenCalled();
    } finally {
      button.remove();
    }
  });

  it('should restore focus to sidebar trigger when sidebar hides', async () => {
    const button = document.createElement('button');
    document.body.appendChild(button);

    const focusSpy = spyOn(button, 'focus');

    component.showSidebar(createClickEvent(button));
    spectator.detectChanges();

    component.onSidebarHide();
    spectator.detectChanges();
    await spectator.fixture.whenStable();
    spectator.detectChanges();

    expect(focusSpy).toHaveBeenCalled();
  });

  it('should open confirm dialog and close it on accept', () => {
    const button = document.createElement('button');

    component.confirmDialog(createClickEvent(button));
    expect(confirmSpy).toHaveBeenCalled();

    const confirmArgs = confirmSpy.calls.mostRecent().args[0];
    expect(confirmArgs.target).toBe(button);

    confirmArgs.accept();
    expect(messageSpy).toHaveBeenCalledWith({severity: 'success', summary: 'Confirmed', detail: 'You have accepted'});
  });

  it('should open confirm dialog and close it on reject', () => {
    const button = document.createElement('button');

    component.confirmDialog(createClickEvent(button));
    expect(confirmSpy).toHaveBeenCalled();

    const confirmArgs = confirmSpy.calls.mostRecent().args[0];
    confirmArgs.reject();

    expect(messageSpy).toHaveBeenCalledWith({severity: 'error', summary: 'Rejected', detail: 'You have rejected'});
  });

  it('should restore focus to confirm dialog trigger when dialog hides', async () => {
    const button = document.createElement('button');
    document.body.appendChild(button);

    const focusSpy = spyOn(button, 'focus');

    component.confirmDialog(createClickEvent(button));
    spectator.detectChanges();

    component.onConfirmDialogHide();
    spectator.detectChanges();
    await spectator.fixture.whenStable();
    spectator.detectChanges();

    expect(focusSpy).toHaveBeenCalled();
  });

  it('should open confirm popup and close it on accept', () => {
    const button = document.createElement('button');

    component.confirmPopup(createClickEvent(button));
    expect(confirmSpy).toHaveBeenCalled();

    const confirmArgs = confirmSpy.calls.mostRecent().args[0];
    confirmArgs.accept();

    expect(messageSpy).toHaveBeenCalledWith({severity: 'info', summary: 'Confirmed', detail: 'You have accepted'});
  });

  it('should open confirm popup and close it on reject', () => {
    const button = document.createElement('button');

    component.confirmPopup(createClickEvent(button));
    expect(confirmSpy).toHaveBeenCalled();

    const confirmArgs = confirmSpy.calls.mostRecent().args[0];
    confirmArgs.reject();

    expect(messageSpy).toHaveBeenCalledWith({severity: 'error', summary: 'Rejected', detail: 'You have rejected'});
  });
});
