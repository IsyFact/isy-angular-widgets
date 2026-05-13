import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  inject,
  Injector,
  OnDestroy
} from '@angular/core';
import {DialogModule} from 'primeng/dialog';
import {InputCharDialogComponent} from '../input-char-dialog/input-char-dialog.component';
import {CharacterService} from '../../services/character.service';
import {WidgetsConfigService} from '../../../i18n/widgets-config.service';
import {InputCharPickerService} from '../../services/input-char-picker.service';
import type {InputCharSelection} from '../../model/model';

@Component({
  standalone: true,
  selector: 'isy-input-char-picker-host',
  templateUrl: './input-char-picker-host.component.html',
  imports: [DialogModule, InputCharDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputCharPickerHostComponent implements OnDestroy {
  readonly pickerService = inject(InputCharPickerService);

  readonly configService = inject(WidgetsConfigService);

  private readonly charService = inject(CharacterService);

  private readonly injector = inject(Injector);

  private triggerCheckTimer?: ReturnType<typeof setTimeout>;

  readonly allCharacters = computed(() => {
    const state = this.pickerService.state();

    if (!state) {
      return [];
    }

    return this.charService.getCharactersByDataType(state.datentyp);
  });

  @HostListener('document:click')
  onDocumentClick(): void {
    if (!this.pickerService.visible()) {
      return;
    }

    if (this.triggerCheckTimer) {
      clearTimeout(this.triggerCheckTimer);
    }

    this.triggerCheckTimer = setTimeout(() => {
      this.triggerCheckTimer = undefined;
      this.closeWhenTriggerIsUnavailable();
    });
  }

  ngOnDestroy(): void {
    if (this.triggerCheckTimer) {
      clearTimeout(this.triggerCheckTimer);
      this.triggerCheckTimer = undefined;
    }
  }

  updateSelection(selection: InputCharSelection | undefined): void {
    this.pickerService.updateSelection(selection);
  }

  updateSelectedCharacter(zeichen: string | undefined): void {
    this.pickerService.updateSelectedCharacter(zeichen);
  }

  insertCharacter(zeichen: string): void {
    this.pickerService.insertCharacter(zeichen);
  }

  onDialogClose(): void {
    const state = this.pickerService.state();
    const triggerElement = this.pickerService.getTriggerElement();

    this.pickerService.close();

    if (triggerElement && this.isElementAvailable(triggerElement) && !this.isDisabledButton(triggerElement)) {
      afterNextRender({write: () => triggerElement.focus()}, {injector: this.injector});
    }

    this.pickerService.finishClose(state);
  }

  private closeWhenTriggerIsUnavailable(): void {
    const triggerElement = this.pickerService.getTriggerElement();

    if (triggerElement && this.isElementAvailable(triggerElement)) {
      return;
    }

    const state = this.pickerService.state();

    this.pickerService.close();
    this.pickerService.finishClose(state);
  }

  private isElementAvailable(element: HTMLElement): boolean {
    return (
      element.isConnected && element.getClientRects().length > 0 && getComputedStyle(element).visibility !== 'hidden'
    );
  }

  private isDisabledButton(element: HTMLElement): boolean {
    return element instanceof HTMLButtonElement && element.disabled;
  }
}
