import {createComponentFactory, Spectator} from '@ngneat/spectator';
import {MessageService} from 'primeng/api';
import {PrimengMessagesComponent} from './primeng-messages.component';
import {messageData} from '../../data/file-option';

describe('Unit Tests: PrimengMessagesComponent', () => {
  let component: PrimengMessagesComponent;
  let spectator: Spectator<PrimengMessagesComponent>;
  const createComponent = createComponentFactory({
    component: PrimengMessagesComponent,
    providers: [MessageService]
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize messages with messageData', () => {
    expect(component.messages).toEqual(messageData);
  });

  it('should add a success toast message on showToastMessage call', () => {
    const spy = spyOn(component.messageService, 'add');
    component.showToastMessage();
    expect(spy).toHaveBeenCalledWith({
      key: 'toast',
      severity: 'success',
      summary: 'Success',
      detail: 'Message Content',
      sticky: true
    });
  });
});
