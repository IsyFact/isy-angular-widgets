import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ControlValueAccessor, FormsModule} from '@angular/forms';
import {InputCharData, InputCharSelection, InputCharSelectionGroup, InputCharSelectionValue} from '../../model/model';
import {SelectButtonModule} from 'primeng/selectbutton';
import {AccordionModule} from 'primeng/accordion';

@Component({
  standalone: true,
  selector: 'isy-multi-select-button',
  templateUrl: './multi-select-button.component.html',
  styleUrls: ['./multi-select-button.component.scss'],
  imports: [CommonModule, FormsModule, AccordionModule, SelectButtonModule]
})
export class MultiSelectButtonComponent implements OnChanges, ControlValueAccessor {
  /**
   * Header title of select all button
   * @internal
   */
  @Input() allButtonOptionsLabel: string = '';

  /**
   * The array who stores an array with every data who must be displayed.
   * @internal
   */
  @Input() dataToDisplay: InputCharData = {
    baseChars: {
      label: '',
      values: []
    },
    groups: {
      label: '',
      values: []
    }
  };

  /**
   * Resets the visible selection state when the picker context changes.
   * @internal
   */
  @Input() resetKey: number = 0;

  @Input() disabled = false;

  /**
   * Current select button value
   * @internal
   */
  @Input() value: InputCharSelection | undefined;

  @Output() valueChange = new EventEmitter<InputCharSelection | undefined>();

  readonly selectionGroups: InputCharSelectionGroup[] = ['baseChars', 'groups'];

  models: Partial<Record<InputCharSelectionGroup, InputCharSelectionValue | undefined>> = {};

  allOptions = [{label: this.allButtonOptionsLabel}];

  allOptionsModel: {label: string} | undefined = this.allOptions[0];

  activeIndex: string | number | string[] | number[] = '';

  /**
   * Lifecycle hook that is called when any data-bound property of the component changes.
   * @param changes - An object containing the changed properties and their current and previous values.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.allButtonOptionsLabel) {
      this.allOptions[0].label = this.allButtonOptionsLabel;
    }

    if (changes.dataToDisplay || changes.value || changes.resetKey) {
      this.writeValue(this.value);
    }
  }

  /**
   * Triggers an update of the selected group and emits the updated value.
   * @param group - The selected group.
   */
  triggerUpdate(group: InputCharSelectionGroup | undefined): void {
    const selectedValue = group ? this.models[group] : undefined;

    this.writeValue(group && selectedValue !== undefined ? {group, value: selectedValue} : undefined);
    this.valueChange.emit(this.value);
  }

  /**
   * Writes a new value to the multi-select button component.
   * @param obj - The new value to be set. It should be an object with `group` and `value` properties.
   */
  writeValue(obj: InputCharSelection | undefined): void {
    this.value = obj;

    this.models = this.selectionGroups.reduce<
      Partial<Record<InputCharSelectionGroup, InputCharSelectionValue | undefined>>
    >((acc, group) => {
      acc[group] = group === obj?.group ? obj.value : undefined;
      return acc;
    }, {});

    this.allOptionsModel = obj ? undefined : this.allOptions[0];
    this.activeIndex = obj ? obj.group : [];
  }

  /**
   * Registers a callback function that will be called when the value of the multi-select button changes.
   * @param fn - The callback function to be registered.
   */
  registerOnChange(fn: unknown): void {
    this.onChange = fn as () => unknown;
  }

  /**
   * Registers a callback function that should be called when the control receives a "blur" event.
   * This is used by Angular forms to update the control's "touched" state.
   * @param fn - The callback function to be registered.
   */
  registerOnTouched(fn: unknown): void {
    this.onTouched = fn as () => unknown;
  }

  /**
   * Sets the disabled state of the component.
   * @param isDisabled - A boolean value indicating whether the component should be disabled or not.
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onChange: (_: unknown) => unknown = () => {};

  onTouched: () => void = () => {};
}
