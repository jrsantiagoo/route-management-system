export interface DriverDayInfo {
    id_: string;
    driverName: string;
    driverId: string;
    date: string;
    activeHours: number;
    fuelConsumed: number;
    distanceTraveled: number;
    status: string;
}

function getToday(): string {
    return new Date().toISOString().split("T")[0];
}

export const mockDriverDayData: DriverDayInfo[] = [
    {
        id_: "DRV-001",
        driverName: "Juan Dela Cruz",
        driverId: "DRV-001",
        date: getToday(),
        activeHours: 7.5,
        fuelConsumed: 14.2,
        distanceTraveled: 92.3,
        status: "Active",
    },
    {
        id_: "DRV-002",
        driverName: "Leon S. Kennedy",
        driverId: "DRV-002",
        date: getToday(),
        activeHours: 6.0,
        fuelConsumed: 11.8,
        distanceTraveled: 78.6,
        status: "Active",
    },
    {
        id_: "DRV-003",
        driverName: "Chris Redfield",
        driverId: "DRV-003",
        date: getToday(),
        activeHours: 2.0,
        fuelConsumed: 3.4,
        distanceTraveled: 40.6,
        status: "Active",
    },
    {
        id_: "DRV-004",
        driverName: "John Doe",
        driverId: "DRV-004",
        date: getToday(),
        activeHours: 7.8,
        fuelConsumed: 23.4,
        distanceTraveled: 176.6,
        status: "Active",
    },
    {
        id_: "DRV-005",
        driverName: "John Smith",
        driverId: "DRV-005",
        date: getToday(),
        activeHours: 4.9,
        fuelConsumed: 7.4,
        distanceTraveled: 55.8,
        status: "Active",
    },
    {
        id_: "DRV-006",
        driverName: "Jane Doe",
        driverId: "DRV-006",
        date: getToday(),
        activeHours: 7.4,
        fuelConsumed: 12.6,
        distanceTraveled: 82.9,
        status: "Active",
    },
    {
        id_: "DRV-007",
        driverName: "Sisyphus",
        driverId: "DRV-007",
        date: getToday(),
        activeHours: 8.0,
        fuelConsumed: 0.0,
        distanceTraveled: 99999,
        status: "Fully Utilized",
    },
];
