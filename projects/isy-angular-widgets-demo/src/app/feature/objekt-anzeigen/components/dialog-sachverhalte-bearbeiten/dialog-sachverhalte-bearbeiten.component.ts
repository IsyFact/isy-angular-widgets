import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {Person} from '../../../../shared/model/person';
import {DialogModule} from 'primeng/dialog';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {TranslateModule} from '@ngx-translate/core';
import {InputGroup} from 'primeng/inputgroup';
import {InputGroupAddonModule} from 'primeng/inputgroupaddon';
import {FormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';

@Component({
  selector: 'demo-dialog-sachverhalte-bearbeiten',
  templateUrl: './dialog-sachverhalte-bearbeiten.component.html',
  imports: [
    FormsModule,
    InputTextModule,
    DialogModule,
    TableModule,
    ButtonModule,
    InputGroup,
    InputGroupAddonModule,
    TranslateModule
  ]
})
export class DialogSachverhalteBearbeitenComponent implements OnChanges {
  @Input() person: Person | undefined;
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  newSachverhalteListe: string[] = [];
  newSachverhalt: string = '';

  ngOnChanges(): void {
    if (this.person === undefined) {
      return;
    }
    this.newSachverhalteListe = Object.assign([], this.person.sachverhalte);
  }

  saveSachverhalte(): void {
    if (this.person === undefined) {
      return;
    }
    this.person.sachverhalte = this.newSachverhalteListe;
    this.closeDialog();
  }

  deleteSachverhalt(sachverhalt: string): void {
    this.newSachverhalteListe = this.newSachverhalteListe.filter((entry) => entry != sachverhalt);
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
