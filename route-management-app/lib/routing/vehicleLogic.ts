import { VehicleType, SuggestedRoute, WeeklyVehicleAvailability } from './types';
import { MOCK_SUGGESTED_ROUTES, MOCK_WEEKLY_AVAILABILITY } from './mockData';

export function recommendVehicle(totalStopCount: number): VehicleType {
  return totalStopCount <= 3 ? 'motorcycle' : 'car';
}

export function getAvailabilityForWeek(week: string): WeeklyVehicleAvailability {
  return (
    MOCK_WEEKLY_AVAILABILITY.find((w) => w.week === week) ?? {
      week,
      motorcycles: 1,
      cars: 2,
    }
  );
}

export async function generateSuggestedRoutes(week: string): Promise<SuggestedRoute[]> {
  await new Promise((r) => setTimeout(r, 1500));

  const availability = getAvailabilityForWeek(week);

  return MOCK_SUGGESTED_ROUTES.filter((route) => {
    if (route.vehicleType === 'motorcycle' && availability.motorcycles === 0) return false;
    if (route.vehicleType === 'car' && availability.cars === 0) return false;
    return true;
  });
}
