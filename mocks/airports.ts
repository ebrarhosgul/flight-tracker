import { AirportResponse } from '@/types';

export const MOCK_AIRPORTS: Record<string, AirportResponse> = {
  LTFM: {
    name: 'Istanbul Airport',
    municipality: 'Istanbul',
    iso_country: 'TR',
    iata_code: 'IST',
    icao_code: 'LTFM',
    latitude_deg: 41.2769,
    longitude_deg: 28.7297,
  },
  OAKB: {
    name: 'Kabul International Airport',
    municipality: 'Kabul',
    iso_country: 'AF',
    iata_code: 'KBL',
    icao_code: 'OAKB',
    latitude_deg: 34.565899,
    longitude_deg: 69.212303,
  },
  ZSPD: {
    name: 'Shanghai Pudong International',
    municipality: 'Shanghai',
    iso_country: 'CN',
    iata_code: 'PVG',
    icao_code: 'ZSPD',
    latitude_deg: 31.1443,
    longitude_deg: 121.8083,
  },
  ZGHY: {
    name: 'Hengyang Nanyue Airport',
    municipality: 'Hengyang',
    iso_country: 'CN',
    iata_code: 'HNY',
    icao_code: 'ZGHY',
    latitude_deg: 26.7236,
    longitude_deg: 112.6192,
  },
};
