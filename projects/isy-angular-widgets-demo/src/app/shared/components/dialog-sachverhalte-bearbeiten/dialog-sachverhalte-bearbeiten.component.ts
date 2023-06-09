import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {Person} from '../../model/person';

@Component({
  selector: 'demo-dialog-sachverhalte-bearbeiten',
  templateUrl: './dialog-sachverhalte-bearbeiten.component.html',
  styleUrls: ['./dialog-sachverhalte-bearbeiten.component.scss']
})
export class DialogSachverhalteBearbeitenComponent implements OnChanges {

  @Input() person: Person | undefined;
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter();

  newSachverhalteListe: string[] = [];
  newSachverhalt: string = '';

  ngOnChanges(): void {
    if (this.person === undefined) {
      return;
    }
    this.newSachverhalteListe = Object.assign([], this.person.sachverhalte.liste);
  }

  saveSachverhalte(): void {
    if (this.person === undefined) {
      return;
    }
    this.person.sachverhalte.liste = this.newSachverhalteListe;
    this.closeDialog();
  }

  deleteSachverhalt(sachverhalt: string): void {
    this.newSachverhalteListe = this.newSachverhalteListe.filter(entry => entry != sachverhalt);
  }

  createSachverhalt(sachverhalt: string): void {
    this.newSachverhalteListe.push(sachverhalt);
    this.newSachverhalt = '';
  }

  closeDialog(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

}
