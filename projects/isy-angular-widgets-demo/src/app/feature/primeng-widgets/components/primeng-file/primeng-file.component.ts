import {Component} from '@angular/core';
import {FileUploadModule, UploadEvent} from 'primeng/fileupload';
import {MessageService} from 'primeng/api';

@Component({
  standalone: true,
  selector: 'demo-primeng-file',
  templateUrl: './primeng-file.component.html',
  imports: [FileUploadModule]
})
export class PrimengFileComponent {
  constructor(public messageService: MessageService) {}

  onUpload(event: UploadEvent): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Success',
      detail: 'File Uploaded with Basic Mode',
      sticky: true
    });
  }
}
