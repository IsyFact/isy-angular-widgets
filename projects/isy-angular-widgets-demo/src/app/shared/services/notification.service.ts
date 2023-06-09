import {Injectable} from '@angular/core';
import {Message, MessageService, PrimeNGConfig} from 'primeng/api';

/**
 * The service responsible for displaying PrimeNG Messages.
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  /**
   * Saves the messages to be displayed
   */
  messages: Message [] = [];

  /**
   * NotificationService Constructor
   * @param messageService Gonna be used
   * @param primengConfig Needed for ripple
   */
  constructor(
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig
  ) {
    this.primengConfig.ripple = true;
  }

  /**
   * @returns a message object
   * Builds a message for the Notification Service to be displayed afterwards.
   * @param severity Der Schweregrad der Nachricht
   * @param summary Die Art der Nachricht
   * @param messageText Der Inhalt der angezeigt wird
   * @param life Die (Lebenszeit) Dauer der Anzeige
   */
  buildMessage(severity: string, summary: string, messageText: string, life?: number): Message {
    return {
      severity: severity,
      summary: summary,
      detail: messageText,
      life: life
    };
  }

  /**
   * Adds a message to display in the 'messages' array.
   * @param messages An array of messages accepting from one to N messages
   */
  addMessages(...messages: Message[]): void {
    this.messages = messages;
    this.messages.forEach(message => {
      this.messageService.add(message);
    });
  }

  /**
   * Clears the array with the existing messages.
   */
  clearMessage(): void {
    this.messages = [];
  }
}
