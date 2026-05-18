import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {ActivatedRoute} from '@angular/router';
import {ViewportScroller} from '@angular/common';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {Subject} from 'rxjs';
import {UploadEvent} from 'primeng/fileupload';
import {MessageService} from 'primeng/api';
import {PrimengFileComponent} from './primeng-file.component';

describe('Unit Tests: PrimengFileComponent', () => {
  const sectionAnchorIds = ['fileupload'];

  let component: PrimengFileComponent;
  let spectator: Spectator<PrimengFileComponent>;
  const fragment$ = new Subject<string | null>();
  const viewportScrollerMock = {
    scrollToAnchor: jasmine.createSpy('scrollToAnchor')
  };

  const createComponent = createComponentFactory({
    component: PrimengFileComponent,
    providers: [
      MessageService,
      provideHttpClient(withInterceptorsFromDi()),
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

  it('should render section heading with hover-only anchor symbol', () => {
    const heading = spectator.query<HTMLHeadingElement>('h2#fileupload');
    const anchor = spectator.query<HTMLAnchorElement>('h2#fileupload > a.section-anchor');

    expect(heading).toBeTruthy();
    expect(heading?.classList.contains('section-heading')).toBeTrue();
    expect(anchor).toBeTruthy();
    expect(anchor?.classList.contains('section-anchor')).toBeTrue();
    expect(anchor?.textContent?.trim()).toBe('🔗');
  });

  it('should render section in full-width container', () => {
    const container = spectator.query<HTMLElement>('.col-12.flex.flex-column.gap-2 h2#fileupload');
    expect(container).toBeTruthy();
  });

  it('should scroll to anchor after initialization when fragment is emitted', () => {
    fragment$.next('fileupload');
    expect(viewportScrollerMock.scrollToAnchor).toHaveBeenCalledWith('fileupload');
  });

  it('should scroll to section when anchor symbol is clicked', () => {
    viewportScrollerMock.scrollToAnchor.calls.reset();
    spectator.click('h2#fileupload > a');
    expect(viewportScrollerMock.scrollToAnchor).toHaveBeenCalledWith('fileupload');
  });

  it('should not scroll when clicking only the heading text', () => {
    spectator.click('h2#fileupload');
    expect(viewportScrollerMock.scrollToAnchor).not.toHaveBeenCalled();
  });

  it('should add success message on file upload', () => {
    const addMessageSpy = spyOn(component.messageService, 'add');
    const mockEvent = {files: []} as unknown as UploadEvent;

    component.onUpload(mockEvent);

    expect(addMessageSpy).toHaveBeenCalledWith({
      severity: 'info',
      summary: 'Success',
      detail: 'File Uploaded with Basic Mode',
      sticky: true
    });
  });
});
