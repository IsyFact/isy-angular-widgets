import {countries, countriesMap} from './country-data';

describe('person-data', () => {
  const countryList = countries;
  const countryMap = countriesMap;
  const countriesTotalNum = 32;
  const countryMapTotalNum = 30;

  it('should check the length of the exported countries map', () => {
    expect(countryList.length).toEqual(countriesTotalNum);
  });

  it('should check the length of the exported countries list', () => {
    const length = Object.keys(countryMap).length;
    expect(length).toEqual(countryMapTotalNum);
  });
});
