import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {UploadEvent} from 'primeng/fileupload';
import {MessageService} from 'primeng/api';

import {PrimengFileComponent} from './primeng-file.component';
import {PrimengWidgetsModule} from '../../primeng-widgets.module';

describe('Unit Tests: PrimengFileComponent', () => {
  let component: PrimengFileComponent;
  let spectator: Spectator<PrimengFileComponent>;
  const createComponent = createComponentFactory({
    component: PrimengFileComponent,
    imports: [PrimengWidgetsModule],
    providers: [MessageService, provideHttpClient(withInterceptorsFromDi())]
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
