import {Component} from '@angular/core';
import {AutoCompleteCompleteEvent} from 'primeng/autocomplete';
import {Country} from '../../model/country';
import {countryCityMapping, countryData} from '../../data/country';

@Component({
  selector: 'demo-primeng-form',
  templateUrl: './primeng-form.component.html',
  styleUrl: './primeng-form.component.scss'
})
export class PrimengFormComponent {
  countries: Country[] = countryData;
  filteredCountries: Country[] = [];
  color: string = '#0055B9';

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  cities: any[] = countryCityMapping;

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
