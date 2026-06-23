"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

export default function PersonalInfoCard() {
    const [newFullname, setNewFullname] = useState("");
    const [newEmail, setNewEmail] = useState("");

    return (
        <div className="flex flex-col gap-2 justify-between rounded-xl bg-card border border-border shadow-lg shadow-primary">
            <div className="flex items-center gap-2 pt-7 pl-7 text-lg font-semibold">
                <Mail size={21} className="text-primary-foreground" />
                Personal Information
            </div>
            <p className="pl-7 text-sm text-muted-foreground">
                Update your personal details
            </p>

            {/* Allows Update of User Info */}
            <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col gap-6 pl-7 pr-7 pb-7 pt-5"
            >
                {/* Current Password Input */}
                <div className="flex flex-col gap-1.5">
                    <label
                        htmlFor="current-password"
                        className="text-sm font-semibold text-foreground"
                    >
                        Full Name
                    </label>
                    <input
                        id="new-fullname"
                        type="text"
                        placeholder="Enter your full name"
                        value={newFullname}
                        onChange={(e) => setNewFullname(e.target.value)}
                        className="bg-background border border-border rounded-lg p-2 text-sm text-foreground w-full 
                            focus:outline-none focus:ring-2 focus:ring-primary-foreground"
                    />
                </div>

                {/* New Password Input */}
                <div className="flex flex-col gap-1.5">
                    <label
                        htmlFor="new-email"
                        className="text-sm font-semibold text-foreground"
                    >
                        Email
                    </label>
                    <input
                        id="new-email"
                        type="email"
                        placeholder="admin@gmail.com"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="bg-background border border-border rounded-lg p-2 text-sm text-foreground w-full 
                            focus:outline-none focus:ring-2 focus:ring-primary-foreground"
                    />
                </div>

                {/* Enables Information Update */}
                <div className="flex justify-end -mt-1 mb-1">
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-semibold text-primary-foreground bg-primary hover:bg-secondary rounded-lg transition"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
