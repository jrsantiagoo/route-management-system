"use client";

import AssignmentForm from "@/components/assignment/assignment-form";

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

            <AssignmentForm />

            <div></div>
        </div>
    );
}
