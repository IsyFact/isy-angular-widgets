import {afterNextRender, ChangeDetectionStrategy, Component, computed, inject, Injector} from '@angular/core';
import {DialogModule} from 'primeng/dialog';
import {InputCharDialogComponent} from '../input-char-dialog/input-char-dialog.component';
import {CharacterService} from '../../services/character.service';
import {WidgetsConfigService} from '../../../i18n/widgets-config.service';
import {InputCharPickerService} from '../../services/input-char-picker.service';

@Component({
  standalone: true,
  selector: 'isy-input-char-picker-host',
  templateUrl: './input-char-picker-host.component.html',
  imports: [DialogModule, InputCharDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputCharPickerHostComponent {
  readonly pickerService = inject(InputCharPickerService);

  readonly configService = inject(WidgetsConfigService);

  private readonly charService = inject(CharacterService);

  private readonly injector = inject(Injector);

  readonly allCharacters = computed(() => {
    const state = this.pickerService.state();

    if (!state) {
      return [];
    }

    return this.charService.getCharactersByDataType(state.datentyp);
  });

  insertCharacter(zeichen: string): void {
    this.pickerService.insertCharacter(zeichen);
  }

  onDialogClose(): void {
    const state = this.pickerService.state();
    const triggerElement = state?.triggerElement;

    this.pickerService.close();

    if (triggerElement && triggerElement.isConnected && !this.isDisabledButton(triggerElement)) {
      afterNextRender({write: () => triggerElement.focus()}, {injector: this.injector});
    }

    this.pickerService.finishClose(state);
  }

  private isDisabledButton(element: HTMLElement): boolean {
    return element instanceof HTMLButtonElement && element.disabled;
  }
}
