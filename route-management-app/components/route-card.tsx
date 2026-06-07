interface RouteCardProps {
    route: string;
    onDelete?: () => void;
}

export default function RouteCard({ route, onDelete }: RouteCardProps) {
    return (
        <div className="flex justify-between font-bold items-center bg-gray-200 rounded p-1 pl-3">
            {route}
            {onDelete && (
                <button onClick={onDelete} className="text-red-600 font-bold">
                    x
                </button>
            )}
        </div>
    );
}
