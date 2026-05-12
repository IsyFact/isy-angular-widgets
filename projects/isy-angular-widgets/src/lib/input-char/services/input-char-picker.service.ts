import {
  ApplicationRef,
  ComponentRef,
  EnvironmentInjector,
  Injectable,
  OnDestroy,
  createComponent,
  inject,
  signal
} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import type {InputCharPickerOpenOptions, InputCharPickerState} from '../model/input-char-picker.model';

@Injectable({
  providedIn: 'root'
})
export class InputCharPickerService implements OnDestroy {
  readonly visible = signal(false);

  readonly state = signal<InputCharPickerState | undefined>(undefined);

  private readonly appRef = inject(ApplicationRef);

  private readonly environmentInjector = inject(EnvironmentInjector);

  private readonly document = inject(DOCUMENT);

  private hostComponentRef?: ComponentRef<unknown>;

  private hostElement?: HTMLElement;

  private hostCreationPromise?: Promise<void>;

  private insertCallback?: (zeichen: string) => void;

  async open(options: InputCharPickerOpenOptions): Promise<void> {
    await this.ensureHostComponent();

    this.insertCallback = options.onInsert;

    this.state.set({
      datentyp: options.datentyp,
      triggerElement: options.triggerElement,
      width: options.width ?? '740px',
      height: options.height ?? '460px',
      header: options.header,
      closable: options.closable ?? true,
      draggable: options.draggable ?? true,
      resizable: options.resizable ?? false,
      dismissableMask: options.dismissableMask ?? false,
      closeOnEscape: options.closeOnEscape ?? true,
      modal: options.modal ?? false
    });

    this.visible.set(true);
  }

  close(): void {
    this.visible.set(false);
  }

  closeFor(triggerElement: HTMLElement): void {
    if (!this.isOpenFor(triggerElement)) {
      return;
    }

    this.close();
  }

  finishClose(closedState?: InputCharPickerState): void {
    if (this.visible()) {
      return;
    }

    if (closedState && this.state() !== closedState) {
      return;
    }

    this.insertCallback = undefined;
    this.state.set(undefined);
  }

  insertCharacter(zeichen: string): void {
    this.insertCallback?.(zeichen);
    this.close();
  }

  isOpenFor(triggerElement: HTMLElement): boolean {
    return this.visible() && this.state()?.triggerElement === triggerElement;
  }

  ngOnDestroy(): void {
    if (!this.hostComponentRef) {
      return;
    }

    this.appRef.detachView(this.hostComponentRef.hostView);
    this.hostComponentRef.destroy();
    this.hostElement?.remove();

    this.hostComponentRef = undefined;
    this.hostElement = undefined;
    this.hostCreationPromise = undefined;
  }

  private async ensureHostComponent(): Promise<void> {
    if (this.hostComponentRef) {
      return;
    }

    this.hostCreationPromise ??= this.createHostComponent().catch((error) => {
      this.hostCreationPromise = undefined;
      throw error;
    });

    await this.hostCreationPromise;
  }

  private async createHostComponent(): Promise<void> {
    const {InputCharPickerHostComponent} =
      await import('../components/input-char-picker-host/input-char-picker-host.component');

    const hostElement = this.document.createElement('isy-input-char-picker-host');

    const componentRef = createComponent(InputCharPickerHostComponent, {
      environmentInjector: this.environmentInjector,
      hostElement
    });

    this.appRef.attachView(componentRef.hostView);
    this.document.body.appendChild(hostElement);

    this.hostElement = hostElement;
    this.hostComponentRef = componentRef;
  }
}
