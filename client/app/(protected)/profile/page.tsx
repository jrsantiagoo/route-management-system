"use client";

import ProfileCard from "@/components/profile-card";

const placeholderAcc = { username: "Admin", email: "admin@gmail.com" };

export default function ProfilePage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col justify-center">
                <h1 className="text-2xl font-bold">Account Profile</h1>
                <p className="text-md text-muted-foreground">
                    Manage your account and personal information
                </p>
            </div>

            <ProfileCard
                username={placeholderAcc.username}
                email={placeholderAcc.email}
                avatarUrl=""
            />

            <div className="flex justify-between rounded-xl bg-card border border-border">
                Personal Information
            </div>

            <div className="flex justify-between rounded-xl bg-card border border-border">
                Change Password
            </div>
        </div>
    );
}
