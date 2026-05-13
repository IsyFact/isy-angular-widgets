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
import type {InputCharSelection} from '../model/model';
import {Datentyp} from '../model/datentyp';

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

  private activeTriggerElement?: HTMLElement;

  private lastTriggerElement?: HTMLElement;

  private resetKey = 0;

  private readonly selectionCache = new WeakMap<HTMLElement, Map<Datentyp, InputCharSelection>>();

  private readonly selectedCharacterCache = new WeakMap<HTMLElement, Map<Datentyp, string>>();

  async open(options: InputCharPickerOpenOptions): Promise<void> {
    await this.ensureHostComponent();

    const currentState = this.state();

    const shouldResetDialog =
      this.lastTriggerElement !== options.triggerElement || currentState?.datentyp !== options.datentyp;

    if (shouldResetDialog) {
      this.resetKey += 1;
    }

    this.insertCallback = options.onInsert;
    this.activeTriggerElement = options.triggerElement;
    this.lastTriggerElement = options.triggerElement;

    this.state.set({
      datentyp: options.datentyp,
      width: options.width ?? '740px',
      height: options.height ?? '460px',
      header: options.header,
      closable: options.closable ?? true,
      draggable: options.draggable ?? true,
      resizable: options.resizable ?? false,
      dismissableMask: options.dismissableMask ?? false,
      closeOnEscape: options.closeOnEscape ?? true,
      modal: options.modal ?? false,
      resetKey: this.resetKey,
      selection: this.getCachedSelection(options.triggerElement, options.datentyp),
      selectedCharacter: this.getCachedSelectedCharacter(options.triggerElement, options.datentyp)
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
    this.activeTriggerElement = undefined;
  }

  insertCharacter(zeichen: string): void {
    this.insertCallback?.(zeichen);
    this.close();
  }

  updateSelection(selection: InputCharSelection | undefined): void {
    const currentState = this.state();
    const triggerElement = this.activeTriggerElement;

    if (!currentState || !triggerElement) {
      return;
    }

    this.setCachedSelection(triggerElement, currentState.datentyp, selection);
    this.setCachedSelectedCharacter(triggerElement, currentState.datentyp, undefined);

    this.state.set({
      ...currentState,
      selection,
      selectedCharacter: undefined
    });
  }

  updateSelectedCharacter(zeichen: string | undefined): void {
    const currentState = this.state();
    const triggerElement = this.activeTriggerElement;

    if (!currentState || !triggerElement) {
      return;
    }

    this.setCachedSelectedCharacter(triggerElement, currentState.datentyp, zeichen);

    this.state.set({
      ...currentState,
      selectedCharacter: zeichen
    });
  }

  isOpenFor(triggerElement: HTMLElement): boolean {
    return this.visible() && this.activeTriggerElement === triggerElement;
  }

  getTriggerElement(): HTMLElement | undefined {
    return this.activeTriggerElement;
  }

  ngOnDestroy(): void {
    if (!this.hostComponentRef) {
      return;
    }

    this.visible.set(false);
    this.state.set(undefined);

    this.appRef.detachView(this.hostComponentRef.hostView);
    this.hostComponentRef.destroy();
    this.hostElement?.remove();

    this.hostComponentRef = undefined;
    this.hostElement = undefined;
    this.hostCreationPromise = undefined;
    this.insertCallback = undefined;
    this.activeTriggerElement = undefined;
    this.lastTriggerElement = undefined;
  }

  private getCachedSelection(triggerElement: HTMLElement, datentyp: Datentyp): InputCharSelection | undefined {
    return this.selectionCache.get(triggerElement)?.get(datentyp);
  }

  private setCachedSelection(
    triggerElement: HTMLElement,
    datentyp: Datentyp,
    selection: InputCharSelection | undefined
  ): void {
    let selectionsByDatentyp = this.selectionCache.get(triggerElement);

    if (!selectionsByDatentyp) {
      selectionsByDatentyp = new Map<Datentyp, InputCharSelection>();
      this.selectionCache.set(triggerElement, selectionsByDatentyp);
    }

    if (!selection) {
      selectionsByDatentyp.delete(datentyp);
      return;
    }

    selectionsByDatentyp.set(datentyp, selection);
  }

  private getCachedSelectedCharacter(triggerElement: HTMLElement, datentyp: Datentyp): string | undefined {
    return this.selectedCharacterCache.get(triggerElement)?.get(datentyp);
  }

  private setCachedSelectedCharacter(
    triggerElement: HTMLElement,
    datentyp: Datentyp,
    selectedCharacter: string | undefined
  ): void {
    let selectedCharactersByDatentyp = this.selectedCharacterCache.get(triggerElement);

    if (!selectedCharactersByDatentyp) {
      selectedCharactersByDatentyp = new Map<Datentyp, string>();
      this.selectedCharacterCache.set(triggerElement, selectedCharactersByDatentyp);
    }

    if (!selectedCharacter) {
      selectedCharactersByDatentyp.delete(datentyp);
      return;
    }

    selectedCharactersByDatentyp.set(datentyp, selectedCharacter);
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
