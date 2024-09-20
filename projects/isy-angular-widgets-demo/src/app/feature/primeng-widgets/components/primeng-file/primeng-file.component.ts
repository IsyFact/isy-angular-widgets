import {Component} from '@angular/core';
import {UploadEvent} from 'primeng/fileupload';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'demo-primeng-file',
  templateUrl: './primeng-file.component.html',
  styleUrl: './primeng-file.component.scss'
})
export class PrimengFileComponent {
  constructor(
    private messageService: MessageService,
  ){}

  onUpload(event: UploadEvent): void {
    this.messageService.add({severity: 'info', summary: 'Success', detail: 'File Uploaded with Basic Mode'});
  }
}
