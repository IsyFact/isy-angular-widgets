import {AfterViewInit, Component, DestroyRef, inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ViewportScroller} from '@angular/common';
import {FileUploadModule, UploadEvent} from 'primeng/fileupload';
import {MessageService} from 'primeng/api';
import {ToastModule} from 'primeng/toast';

@Component({
  standalone: true,
  selector: 'demo-primeng-file',
  templateUrl: './primeng-file.component.html',
  imports: [FileUploadModule, ToastModule]
})
export class PrimengFileComponent implements AfterViewInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly viewportScroller = inject(ViewportScroller);
  messageService = inject(MessageService);

  ngAfterViewInit(): void {
    this.activatedRoute.fragment.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((fragment) => {
      if (fragment) {
        this.viewportScroller.scrollToAnchor(fragment);
      }
    });
  }

  scrollToWidget(event: MouseEvent, anchor: string): void {
    event.preventDefault();
    this.viewportScroller.scrollToAnchor(anchor);
    window.history.replaceState(
      window.history.state,
      '',
      `${window.location.pathname}${window.location.search}#${anchor}`
    );
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
