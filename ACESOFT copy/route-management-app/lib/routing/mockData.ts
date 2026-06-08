import { Stop, WeeklyVehicleAvailability } from './types';

export const MANILA_LOCATIONS: Stop[] = [
  {
    id: 'loc-001',
    name: 'Rizal Park',
    address: 'Roxas Blvd, Ermita, Manila 1000',
    lat: 14.5832,
    lng: 120.9794,
  },
  {
    id: 'loc-002',
    name: 'SM Mall of Asia',
    address: 'J.W. Diokno Blvd, Pasay City 1300',
    lat: 14.5352,
    lng: 120.9831,
  },
  {
    id: 'loc-003',
    name: 'Bonifacio Global City',
    address: 'High Street, BGC, Taguig City 1634',
    lat: 14.5492,
    lng: 121.0523,
  },
  {
    id: 'loc-004',
    name: 'Makati CBD',
    address: 'Ayala Avenue, Makati City 1226',
    lat: 14.5547,
    lng: 121.0244,
  },
  {
    id: 'loc-005',
    name: 'Quiapo Church',
    address: 'Plaza Miranda, Quiapo, Manila 1001',
    lat: 14.5995,
    lng: 120.9842,
  },
  {
    id: 'loc-006',
    name: 'Divisoria Market',
    address: 'C.M. Recto Ave, Divisoria, Manila',
    lat: 14.6021,
    lng: 120.9726,
  },
  {
    id: 'loc-007',
    name: 'SM City North EDSA',
    address: 'North Avenue, Quezon City 1106',
    lat: 14.6566,
    lng: 121.0333,
  },
  {
    id: 'loc-008',
    name: 'Eastwood City',
    address: 'Bagumbayan, Quezon City 1110',
    lat: 14.6070,
    lng: 121.0779,
  },
];

export const DEFAULT_STOPS: Stop[] = [
  MANILA_LOCATIONS[0],
  MANILA_LOCATIONS[3],
  MANILA_LOCATIONS[2],
  MANILA_LOCATIONS[4],
];

export const MOCK_WEEKLY_AVAILABILITY: WeeklyVehicleAvailability[] = [
  { week: '2026-06-09', motorcycles: 2, cars: 3 },
  { week: '2026-06-16', motorcycles: 1, cars: 4 },
  { week: '2026-06-23', motorcycles: 3, cars: 2 },
  { week: '2026-06-30', motorcycles: 2, cars: 3 },
];
