"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { changePassword } from "../../lib/api/auth";

export default function ChangePasswordCard() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await changePassword(currentPassword, newPassword, confirmPassword);
            if (result.error) {
                alert(result.error); // or show error in UI
            } else {
                alert("Password changed successfully!");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="flex flex-col gap-2 justify-between rounded-xl bg-card border border-border shadow-xl shadow-primary">
            <div className="flex items-center gap-2 pt-7 pl-7 text-lg font-semibold">
                <Lock size={21} className="text-primary-foreground" />
                Change Password
            </div>
            <p className="pl-7 text-sm text-muted-foreground">
                Update your password
            </p>

            {/* Enables Password Change */}
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-6 pl-7 pr-7 pb-7 pt-5"
            >
                {/* Current Password Input */}
                <div className="flex flex-col gap-1.5">
                    <label
                        htmlFor="current-password"
                        className="text-sm font-semibold text-foreground"
                    >
                        Current Password
                    </label>
                    <input
                        id="current-password"
                        type="password"
                        placeholder="Enter current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="bg-background border border-border rounded-lg p-2 text-sm text-foreground w-full 
                            focus:outline-none focus:ring-2 focus:ring-primary-foreground"
                    />
                </div>

                {/* New Password Input */}
                <div className="flex flex-col gap-1.5">
                    <label
                        htmlFor="new-password"
                        className="text-sm font-semibold text-foreground"
                    >
                        New Password
                    </label>
                    <input
                        id="current-password"
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="bg-background border border-border rounded-lg p-2 text-sm text-foreground w-full 
                            focus:outline-none focus:ring-2 focus:ring-primary-foreground"
                    />
                </div>

                {/* Confirm New Password Input */}
                <div className="flex flex-col gap-1.5">
                    <label
                        htmlFor="confirm-password"
                        className="text-sm font-semibold text-foreground"
                    >
                        Confirm New Password
                    </label>
                    <input
                        id="current-password"
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="bg-background border border-border rounded-lg p-2 text-sm text-foreground w-full 
                            focus:outline-none focus:ring-2 focus:ring-primary-foreground"
                    />
                </div>

                {/* Enables Password Change */}
                <div className="flex justify-end -mt-1 mb-1">
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
                    >
                        Update Password
                    </button>
                </div>
            </form>
        </div>
    );
}
