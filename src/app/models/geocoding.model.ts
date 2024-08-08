export interface LocationInfo{
    name: string;
    latitude: number;
    longitude: number;
    admin1: string; //regione (o simili) [piú ampio]
    admin2: string; //provincia (o simili) [piú stretto]
    admin3: string; //nome cittá (a volte diverso da name)
    country_code: string; // sigla nazione
}