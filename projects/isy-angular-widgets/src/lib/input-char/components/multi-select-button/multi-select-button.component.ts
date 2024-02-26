import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {InputCharData} from '../../model/model';
import {ControlValueAccessor} from '@angular/forms';

@Component({
  selector: 'isy-multi-select-button',
  templateUrl: './multi-select-button.component.html',
  styleUrl: './multi-select-button.component.scss'
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
  @Input() dataToDisplay: InputCharData = {};

  @Input() disabled = false;

  /**
   * Current select button value
   * @internal
   */
  @Input() value: {group: string; value: string} | undefined;

  @Output() valueChange = new EventEmitter<{group: string; value: string} | undefined>();

  models: {[key: string]: string} = {};

  allOptions = [{label: this.allButtonOptionsLabel}];

  allOptionsModel: {label: string} | undefined = this.allOptions[0];

  ngOnChanges(changes: SimpleChanges): void {
    this.allOptions[0].label = this.allButtonOptionsLabel;
  }

  onChange: (_: unknown) => unknown = () => {};

  onTouched: () => void = () => {};

  triggerUpdate(group: string | undefined): void {
    this.writeValue(group ? {group: group, value: this.models[group]} : undefined);
    this.valueChange.emit(this.value);
  }

  writeValue(obj: {group: string; value: string} | undefined): void {
    this.value = obj;

    for (const item in this.models) {
      this.models[item] = item === obj?.group ? obj.value : '';
    }
    this.allOptionsModel = obj ? undefined : {label: this.allButtonOptionsLabel};
  }

  registerOnChange(fn: unknown): void {
    this.onChange = fn as () => unknown;
  }

  registerOnTouched(fn: unknown): void {
    this.onTouched = fn as () => unknown;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
