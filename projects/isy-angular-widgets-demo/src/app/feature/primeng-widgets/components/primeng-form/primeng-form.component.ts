import {Component} from '@angular/core';
import {AutoCompleteCompleteEvent} from 'primeng/autocomplete';

import {Country} from '../../model/country';
import {countryCityMapping, countryData} from '../../data/country';
import {FileOption} from '../../model/file-option';
import {fileOptionData} from '../../data/file-option';

@Component({
  selector: 'demo-primeng-form',
  templateUrl: './primeng-form.component.html'
})
export class PrimengFormComponent {
  countries: Country[] = countryData;
  filteredCountries: Country[] = [];
  files: FileOption[] = fileOptionData;

  color: string = '#0055B9';
  password: string = '';
  ingredient: string = '';

  stateOptions: string[] = ['Off', 'On'];
  slider: number = 0;

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  cities: any[] = countryCityMapping;

  // Variable to hold the text entered in the editor
  text: string = '';

  filterCountry(event: AutoCompleteCompleteEvent): void {
    const filtered: Country[] = [];
    const query = event.query;

    for (const country of this.countries) {
      if (country.name.toLowerCase().startsWith(query.toLowerCase())) {
        filtered.push(country);
      }
    }

    this.filteredCountries = filtered;
  }
}
