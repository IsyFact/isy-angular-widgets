import {createDirectiveFactory, SpectatorDirective} from '@ngneat/spectator';
import {FileUploadDirective} from './file-upload.directive';

describe('Integration Tests: FileUploadDirective', ()=> {
  let spectator: SpectatorDirective<FileUploadDirective>;
  const createdDirective = createDirectiveFactory(FileUploadDirective);

  beforeEach(()=> spectator = createdDirective(''));

  it('should create', ()=> {
    expect(spectator.directive).toBeTruthy();
  });
});
