import {AfterViewInit, Component, DestroyRef, inject} from '@angular/core';
import {FileUploadModule, UploadEvent} from 'primeng/fileupload';
import {MessageService} from 'primeng/api';
import {ToastModule} from 'primeng/toast';
import {AnchorNavigationService} from '../../../../shared/services/anchor-navigation.service';
import {SectionHeadingComponent} from '../../../../shared/components/section-heading/section-heading.component';

@Component({
  standalone: true,
  selector: 'demo-primeng-file',
  templateUrl: './primeng-file.component.html',
  imports: [FileUploadModule, ToastModule, SectionHeadingComponent]
})
export class PrimengFileComponent implements AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly anchorNav = inject(AnchorNavigationService);
  messageService = inject(MessageService);

  ngAfterViewInit(): void {
    this.anchorNav.initFragmentScroll(this.destroyRef);
  }

  scrollToWidget(event: MouseEvent, anchor: string): void {
    this.anchorNav.scrollToAnchor(event, anchor);
  }

  onUpload(event: UploadEvent): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Success',
      detail: 'File Uploaded with Basic Mode',
      sticky: true
    });
  }
}
