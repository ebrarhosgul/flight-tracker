import { AirportResponse } from '@/types';

export const MOCK_AIRPORTS: Record<string, AirportResponse> = {
  OAKB: {
    name: 'Kabul International Airport',
    municipality: 'Kabul',
    iso_country: 'AF',
    iata_code: 'KBL',
    icao_code: 'OAKB',
  },
  ZSPD: {
    name: 'Shanghai Pudong International',
    municipality: 'Shanghai',
    iso_country: 'CN',
    iata_code: 'PVG',
    icao_code: 'ZSPD',
  },
  ZGHY: {
    name: 'Hengyang Nanyue Airport',
    municipality: 'Hengyang',
    iso_country: 'CN',
    iata_code: 'HNY',
    icao_code: 'ZGHY',
  },
  LTFM: {
    name: 'Istanbul Airport',
    municipality: 'Istanbul',
    iso_country: 'TR',
    iata_code: 'IST',
    icao_code: 'LTFM',
  },
};
