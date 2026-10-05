import type {MockInstance} from 'vitest';
import {createComponentFactory, Spectator} from '@ngneat/spectator/vitest';
import {ActivatedRoute} from '@angular/router';
import {ViewportScroller} from '@angular/common';
import {Subject} from 'rxjs';
import {PrimengOverlayComponent} from './primeng-overlay.component';

describe('Unit Tests: PrimengOverlayComponent', () => {
  const sectionAnchorIds = ['sidebar', 'dialog', 'confirmdialog', 'confirmpopup', 'tooltip', 'overlaypanel'];

  let component: PrimengOverlayComponent;
  let spectator: Spectator<PrimengOverlayComponent>;
  let confirmSpy: MockInstance;
  let messageSpy: MockInstance;

  const fragment$ = new Subject<string | null>();
  const viewportScrollerMock = {
    scrollToAnchor: vi.fn()
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
    viewportScrollerMock.scrollToAnchor.mockClear();
    spectator = createComponent();
    component = spectator.component;

    confirmSpy = spyOn(component.confirmationService, 'confirm');
    messageSpy = spyOn(component.messageService, 'add');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all section headings with hover-only anchor symbols', () => {
    sectionAnchorIds.forEach((id) => {
      const heading = spectator.query<HTMLHeadingElement>(`h3#${id}`);
      const anchor = spectator.query<HTMLAnchorElement>(`h3#${id} > a.section-anchor`);

      expect(heading).toBeTruthy();
      expect(heading?.classList.contains('section-heading')).toBe(true);
      expect(anchor).toBeTruthy();
      expect(anchor?.classList.contains('section-anchor')).toBe(true);
      expect(anchor?.textContent?.trim()).toBe('🔗');
    });
  });

  it('should render all widgets in full-width containers', () => {
    sectionAnchorIds.forEach((id) => {
      const container = spectator.query<HTMLElement>(`.col-span-12.flex.flex-col.gap-2 h3#${id}`);
      expect(container).toBeTruthy();
    });
  });

  it('should not mark closed overlays as printable', () => {
    expect(spectator.query('.isy-print-overlay')).toBeFalsy();
    expect(spectator.query('.isy-print-overlay-mask')).toBeFalsy();
  });

  it('should mark only rendered overlays as printable and their dialog actions as hidden', () => {
    component.visibleSidebar = true;
    component.visibleDialog = true;
    spectator.detectComponentChanges();

    expect(spectator.query('.demo-print-page')).toBeTruthy();
    expect(spectator.queryAll('.isy-print-overlay')).toHaveLength(2);
    expect(spectator.query('.isy-print-overlay-mask')).toBeTruthy();
    expect(spectator.queryAll('p-button.isy-print-hide')).toHaveLength(5);
    expect(spectator.query('.demo-dialog-actions.isy-print-hide')).toBeTruthy();
  });

  it('should scroll to anchor after initialization when fragment is emitted', () => {
    fragment$.next('dialog');
    expect(viewportScrollerMock.scrollToAnchor).toHaveBeenCalledWith('dialog');
  });

  it('should scroll to section when anchor symbol is clicked', () => {
    sectionAnchorIds.forEach((id) => {
      viewportScrollerMock.scrollToAnchor.mockClear();
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
    expect(component.visibleDialog).toBe(true);
  });

  it('should close dialog', () => {
    component.visibleDialog = true;
    component.closeDialog();
    expect(component.visibleDialog).toBe(false);
  });

  it('should show sidebar', () => {
    const button = document.createElement('button');
    component.showSidebar(createClickEvent(button));
    expect(component.visibleSidebar).toBe(true);
  });

  it('should restore focus to dialog trigger when dialog hides', async () => {
    const button = document.createElement('button');
    document.body.appendChild(button);

    try {
      const focusSpy = spyOn(button, 'focus');

      component.showDialog(createClickEvent(button));
      spectator.detectComponentChanges();

      component.onDialogHide();
      spectator.detectComponentChanges();
      await spectator.fixture.whenStable();
      spectator.detectComponentChanges();

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
    spectator.detectComponentChanges();

    component.onSidebarHide();
    spectator.detectComponentChanges();
    await spectator.fixture.whenStable();
    spectator.detectComponentChanges();

    expect(focusSpy).toHaveBeenCalled();
  });

  it('should open confirm dialog and close it on accept', () => {
    const button = document.createElement('button');

    component.confirmDialog(createClickEvent(button));
    expect(confirmSpy).toHaveBeenCalled();

    const confirmArgs = confirmSpy.mock.lastCall![0];
    expect(confirmArgs.target).toBe(button);

    confirmArgs.accept();
    expect(messageSpy).toHaveBeenCalledWith({severity: 'success', summary: 'Confirmed', detail: 'You have accepted'});
  });

  it('should open confirm dialog and close it on reject', () => {
    const button = document.createElement('button');

    component.confirmDialog(createClickEvent(button));
    expect(confirmSpy).toHaveBeenCalled();

    const confirmArgs = confirmSpy.mock.lastCall![0];
    confirmArgs.reject();

    expect(messageSpy).toHaveBeenCalledWith({severity: 'error', summary: 'Rejected', detail: 'You have rejected'});
  });

  it('should restore focus to confirm dialog trigger when dialog hides', async () => {
    const button = document.createElement('button');
    document.body.appendChild(button);

    const focusSpy = spyOn(button, 'focus');

    component.confirmDialog(createClickEvent(button));
    spectator.detectComponentChanges();

    component.onConfirmDialogHide();
    spectator.detectComponentChanges();
    await spectator.fixture.whenStable();
    spectator.detectComponentChanges();

    expect(focusSpy).toHaveBeenCalled();
  });

  it('should open confirm popup and close it on accept', () => {
    const button = document.createElement('button');

    component.confirmPopup(createClickEvent(button));
    expect(confirmSpy).toHaveBeenCalled();

    const confirmArgs = confirmSpy.mock.lastCall![0];
    confirmArgs.accept();

    expect(messageSpy).toHaveBeenCalledWith({severity: 'info', summary: 'Confirmed', detail: 'You have accepted'});
  });

  it('should open confirm popup and close it on reject', () => {
    const button = document.createElement('button');

    component.confirmPopup(createClickEvent(button));
    expect(confirmSpy).toHaveBeenCalled();

    const confirmArgs = confirmSpy.mock.lastCall![0];
    confirmArgs.reject();

    expect(messageSpy).toHaveBeenCalledWith({severity: 'error', summary: 'Rejected', detail: 'You have rejected'});
  });
});
