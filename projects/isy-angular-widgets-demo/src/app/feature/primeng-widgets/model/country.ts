/**
 * An interface for displaying cities with their three-letter code
 */
export interface City {
  name: string;
  code: string;
}

/**
 * An interface to connect a state with their cities
 */
export interface State {
  name: string;
  cities: City[];
}

/**
 * An interface for displaying countries with their three-letter code
 */
export interface Country {
  name: string;
  code: string;
}

export interface CountryCityMap {
  name: string;
  states: State[];
}
