interface RouteCardProps {
    route: string;
    onDelete?: () => void;
}

// Provides a visual route card so it can be displayed consistently in the
// list and assignment cells.
export default function RouteCard({ route, onDelete }: RouteCardProps) {
    return (
        <div className="flex justify-between font-bold items-center bg-gray-200 rounded p-1 pl-3">
            {route}
            {onDelete && (
                <button
                    onClick={onDelete}
                    className="font-bold text-red-600 hover:text-red-400"
                >
                    x
                </button>
            )}
        </div>
    );
}
