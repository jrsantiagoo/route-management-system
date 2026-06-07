// Placeholder data for drivers
const drivers = [
    "Driver 1",
    "Driver 2",
    "Driver 3",
    "Driver 4",
    "Driver 5",
    "Driver 6",
    "Driver 7",
    "Driver 8",
    "Driver 9",
    "Driver 10",
    "Driver 11",
    "Driver 12",
    "Driver 13",
    "Driver 14",
    "Driver 15",
    "Driver 16",
    "Driver 17",
    "Driver 18",
    "Driver 19",
    "Driver 20",
    "Driver 21",
    "Driver 22",
    "Driver 23",
    "Driver 24",
];

// Placeholder data for routes
const routes = [
    "Route A",
    "Route B",
    "Route C",
    "Route D",
    "Route E",
    "Route F",
    "Route G",
    "Route H",
    "Route I",
    "Route J",
    "Route K",
    "Route L",
    "Route M",
];

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Assignment() {
    return (
        <main className="flex font-bold min-h-screen gap-5.5">
            {/* Displays the list of routes */}
            <div className="flex flex-col text-left rounded w-67 max-h-118 shadow-lg shadow-gray-400">
                {/* Displays header and search bar */}
                <div className="p-2 rounded-t border-b border-gray-200">
                    <h2>Saved Routes</h2>
                    <input
                        type="text"
                        placeholder="Search routes..."
                        className="font-normal border border-gray-200 rounded p-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>

                {/* Auto-adds Placeholder routes as draggable cards*/}
                <div className="flex flex-col gap-1.5 p-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {routes.map((route) => (
                        <div
                            key={route}
                            className="p-1 pl-3 rounded bg-gray-200 hover:bg-gray-300"
                        >
                            {route}
                        </div>
                    ))}
                </div>
            </div>

            {/* Displays the assignment table */}
            <div className="p-4 w-250 h-184 rounded bg-gray-200 shadow-lg shadow-gray-300">
                <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-200">
                    <table className="w-full rounded">
                        <thead className="sticky top-0 bg-gray-200 z-10 text-center border-b-2 border-gray-300">
                            <tr>
                                <th className="p-2">Drivers</th>

                                {/* Auto-adds day columns*/}
                                {daysOfWeek.map((day) => (
                                    <th key={day} className="w-28 h-12 p-2">
                                        {day}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {/* Auto-adds placeholder driver values as rows*/}
                            {drivers.map((driver) => (
                                <tr
                                    key={driver}
                                    className="border-t border-gray-200 hover:bg-gray-300"
                                >
                                    <td className="p-2">{driver}</td>

                                    {daysOfWeek.map((day) => (
                                        <td
                                            key={`${driver}-${day}`}
                                            className="border border-gray-300 pt-2 pb-2"
                                        >
                                            {/* Placeholder for route assignment cards */}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}
