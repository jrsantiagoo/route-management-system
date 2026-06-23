"use client";

import ChangePasswordCard from "@/components/profile/change-password-card";
import PersonalInfoCard from "@/components/profile/personal-info";
import ProfileCard from "@/components/profile/avatar-card";

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

            <PersonalInfoCard />

            <ChangePasswordCard />
        </div>
    );
}
