import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FileUploadDirective} from './directives/file-upload.directive';

@NgModule({
  declarations: [FileUploadDirective],
  exports: [FileUploadDirective],
  imports: [CommonModule]
})
export class FileUploadModule {}
