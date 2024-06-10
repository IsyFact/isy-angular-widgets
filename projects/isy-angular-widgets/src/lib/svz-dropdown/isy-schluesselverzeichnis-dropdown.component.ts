import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DropdownModule} from 'primeng/dropdown';

interface City {
  name: string;
  code: string;
}

@Component({
  selector: 'isy-svz-dropdown',
  templateUrl: './isy-schluesselverzeichnis-dropdown.component.html',
  styleUrl: 'isy-schluesselverzeichnis-dropdown.component.scss',
  standalone: true,
  imports: [FormsModule, DropdownModule]
})
export class SvzDropdownComponent implements OnInit {
  countries: City[] | undefined;
  selectedCountry: string | undefined;

  ngOnInit(): void {
    this.countries = [
      {name: 'Australia', code: 'AU'},
      {name: 'Brazil', code: 'BR'},
      {name: 'China', code: 'CN'},
      {name: 'Egypt', code: 'EG'},
      {name: 'France', code: 'FR'},
      {name: 'Germany', code: 'DE'},
      {name: 'India', code: 'IN'},
      {name: 'Japan', code: 'JP'},
      {name: 'Spain', code: 'ES'},
      {name: 'United States', code: 'US'}
    ];
  }
}
