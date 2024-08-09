export interface LocationInfo {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    elevation: number;
    feature_code: string;
    country_code: string;
    admin1: string; // regione
    admin2: string; // provincia
    admin3: string; // città
    timezone: string;
    population: number;
    postcodes: string[];
    country: string;
  }
  