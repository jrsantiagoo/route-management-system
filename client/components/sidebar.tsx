"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/dist/client/link";
import * as authApi from "@/lib/api/auth";
import * as managerApi from "@/lib/api/manager";

// This component renders the sidebar with navigation links.
export default function Sidebar() {
    // This allows us to highlight the active page in sidebar.
    const pathname = usePathname();
    const router = useRouter();
    const [name, setName] = useState("");

    async function fetchProfile() {
        const accessToken = localStorage.getItem("access_token");

        if (!accessToken) {
            router.push("/");
            return;
        }

        const data = await managerApi.getProfile(accessToken);

        if (data.success) {
            const { firstname, lastname } = data.data;
            setName(`${firstname} ${lastname}`);
        }
    }

    useEffect(() => {
        fetchProfile();
    }, []);

    async function handleLogout() {
        await authApi.logout();

        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        router.push("/");
    }

    return (
        // The sidebar is fixed to the left of the screen
        <div className="fixed top-0 left-0 h-screen w-64 p-2 font-bold rounded-r-md shadow-lg shadow-gray-600 bg-gray-300">
            <div className="flex items-center gap-4 p-3 rounded bg-gray-400">
                <div className="w-13 h-13 rounded-full bg-gray-200"> </div>
                <span className="text-sm truncate">{name || "Loading..."}</span>
            </div>

            {/* Formats the nav links and highlights the active page */}
            <div className="flex flex-col gap-1 pt-3 text-center mt-7">
                <Link
                    href="/dashboard"
                    className={`rounded p-2 ${pathname === "/dashboard" ? "bg-gray-400" : "bg-gray-300 hover:bg-gray-400"}`}
                >
                    Dashboard
                </Link>
                <Link
                    href="/route-tool"
                    className={`rounded p-2 ${pathname === "/route-tool" ? "bg-gray-400" : "bg-gray-300 hover:bg-gray-400"}`}
                >
                    Routing Tool
                </Link>
                <Link
                    href="/assignment"
                    className={`rounded p-2 ${pathname === "/assignment" ? "bg-gray-400" : "bg-gray-300 hover:bg-gray-400"}`}
                >
                    Assignment
                </Link>
            </div>

            {/* This only redirects user to the Home page (login page)
                TODO: Implement logout function 
              */}
            <div className="absolute bottom-0 text-right w-full p-4">
                <button
                    onClick={handleLogout}
                    className="rounded p-2 bg-gray-400 hover:bg-gray-500"
                >
                    Log Out
                </button>
            </div>
        </div>
    );
}
