import {TestBed} from '@angular/core/testing';

import {NotificationService} from './notification.service';
import {Message, MessageService} from 'primeng/api';
import {TOAST_MESSAGE, TOAST_SEVERITY, TOAST_SUMMARY} from '../model/toast';
import {ToastModule} from 'primeng/toast';

describe('NotificationService', () => {
  let service: NotificationService;

  /**
   * @returns a message object
   * @param severity specifies the type of the message
   * @param summary summary of the message
   * @param messageText the text of the message
   */
  function buildMessage(severity: string, summary: string, messageText: string): Message {
    return {
      severity: severity,
      summary: summary,
      detail: messageText
    };
  }

  /**
   *
   * @param expected message array
   * @param actual message array
   */
  function expectSameLength(expected: Message[], actual: Message[]): void {
    expect(actual.length).toEqual(expected.length);
  }

  /**
   *
   * @param expected message array
   * @param actual message array
   */
  function expectArrayBeSame(expected: Message[], actual: Message[]): void {
    for (let i = 0; i < expected.length; i++) {
      expect(actual[i]).toEqual(expected[i]);
    }
  }

  const firstMessage = buildMessage(
    TOAST_SEVERITY.SUCCESS,
    TOAST_SUMMARY.SUCCESS,
    TOAST_MESSAGE.SUCCESS
  );
  const secondMessage = buildMessage(
    TOAST_SEVERITY.INFO,
    TOAST_SUMMARY.INFO,
    TOAST_MESSAGE.INFO
  );
  const thirdMessage = buildMessage(
    TOAST_SEVERITY.WARN,
    TOAST_SUMMARY.WARN,
    TOAST_MESSAGE.WARN
  );
  const originalMessages = [
    firstMessage,
    secondMessage,
    thirdMessage
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        MessageService
      ],
      imports: [
        ToastModule
      ]
    });
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should check the message array length on init', () => {
    expectSameLength(service.messages, []);
    expectArrayBeSame(service.messages, []);
  });

  it('should add a message', () => {
    service.addMessages(originalMessages[0]);

    expectSameLength([originalMessages[0]], service.messages);
    expectArrayBeSame([originalMessages[0]], service.messages);
  });

  it('should add multiple messages', () => {
    service.addMessages(
      firstMessage,
      secondMessage,
      thirdMessage
    );

    expectSameLength(originalMessages, service.messages);
    expectArrayBeSame(originalMessages, service.messages);
  });

  it('should clear all added messages', () => {
    service.clearMessage();

    expectSameLength(service.messages, []);
    expectArrayBeSame(service.messages, []);
  });

  it('should create a message for the notification dateService and the PrimeNG Toast (without lifetime)', () => {
    const message = service.buildMessage(
      TOAST_SEVERITY.SUCCESS,
      TOAST_SUMMARY.SUCCESS,
      TOAST_MESSAGE.SUCCESS
    );

    expect(message).toBeTruthy();
    expect(message.severity).toEqual(TOAST_SEVERITY.SUCCESS);
    expect(message.summary).toEqual(TOAST_SUMMARY.SUCCESS);
    expect(message.detail).toEqual(TOAST_MESSAGE.SUCCESS);
  });

  it('should create a message for the notification dateService and the PrimeNG Toast (with lifetime)', () => {
    const lifetime = 2000;
    const message = service.buildMessage(
      TOAST_SEVERITY.SUCCESS,
      TOAST_SUMMARY.SUCCESS,
      TOAST_MESSAGE.SUCCESS,
      lifetime
    );

    expect(message).toBeTruthy();
    expect(message.severity).toEqual(TOAST_SEVERITY.SUCCESS);
    expect(message.summary).toEqual(TOAST_SUMMARY.SUCCESS);
    expect(message.detail).toEqual(TOAST_MESSAGE.SUCCESS);
    expect(message.life).toEqual(lifetime);
  });
});
