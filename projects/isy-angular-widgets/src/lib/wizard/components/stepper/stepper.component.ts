import {Component, Input} from '@angular/core';
import {MenuItem} from 'primeng/api';

/**
 * @internal
 */
@Component({
  selector: 'isy-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent {
  @Input() items!: MenuItem[];

  @Input() index: number = 0;

  move(next: boolean): void {
    if (next) {
      this.next();
    }

    if (!next) {
      this.previous();
    }
  }

  private next(): void {
    if (this.index < this.items.length) {
      this.index++;
    }
  }

  private previous(): void {
    if (this.index > 0) {
      this.index--;
    }
  }

  reset(): void {
    this.index = 0;
  }
}
