"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ChangePasswordCard from "@/components/profile/change-password-card";
import ProfileCard from "@/components/profile/avatar-card";
import * as managerApi from "@/lib/api/manager";

export default function ProfilePage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");

    async function fetchProfile() {
        const accessToken = localStorage.getItem("access_token");

        if (!accessToken) {
            router.push("/");
            return;
        }

        const data = await managerApi.getProfile(accessToken);

        if (data.success) {
            const { firstname, lastname } = data.data;
            setUsername(`${firstname} ${lastname}`);
            setEmail(data.data.email);
        }
    }

    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col justify-center">
                <h1 className="text-3xl font-bold">Account Profile</h1>
                <p className="text-md text-muted-foreground">
                    Manage your account
                </p>
            </div>

            <ProfileCard username={username} email={email} />

            <ChangePasswordCard />
        </div>
    );
}
