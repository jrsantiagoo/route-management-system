"use client";

export default function Assignment() {
    return (
        <div className="flex flex-col gap-6">
            {/* Header with title and download button */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col justify-center">
                    <h1 className="text-2xl font-bold">Route Assignment</h1>
                    <p className="text-md text-muted-foreground">
                        Assign Routes and Plan Trips
                    </p>
                </div>
            </div>

            <div>
                <button
                    className="flex items-center rounded-lg gap-2 px-3 py-1.5 bg-card text-sm font-medium 
                        border border-border text-foreground hover:bg-secondary dark:hover:text-primary transition"
                >
                    Assign Route
                </button>
            </div>

            <div></div>
        </div>
    );
}
