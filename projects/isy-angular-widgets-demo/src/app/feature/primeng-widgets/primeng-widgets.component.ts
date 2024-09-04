import {Component} from '@angular/core';
import {AutoCompleteCompleteEvent} from 'primeng/autocomplete';
import {Country} from './model/country';
import {countryData} from './data/country';

@Component({
  selector: 'demo-primeng-widgets',
  templateUrl: './primeng-widgets.component.html',
  styleUrl: './primeng-widgets.component.scss'
})
export class PrimengWidgetsComponent {
  countries: Country[] = countryData;

  filteredCountries: Country[] = [];

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
