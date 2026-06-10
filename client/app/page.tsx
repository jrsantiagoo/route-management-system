"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiCall } from "@/lib/api/client";
import * as authApi from "@/lib/api/auth";

//login page with email and password fields, error handling, and loading state. On successful login, navigate to dashboard page
export default function loginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!email && !password) {
            setError("Email and password are required");
            setLoading(false);
            return;
        }

        if (!email) {
            setError("Email is required");
            setLoading(false);
            return;
        }

        if (!password) {
            setError("Password is required");
            setLoading(false);
            return;
        }

        // connect to backend and get access token and refresh token, then store them in local storage
        try {
            /*
            const response = await apiCall("/api/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const data = await response.json();
                setError(data.error || "Login failed");
                setLoading(false);
                return;
            }

            const { access_token, refresh_token } = await response.json();

            // Store tokens
            localStorage.setItem("access_token", access_token);
            localStorage.setItem("refresh_token", refresh_token);
            */
            const data = await authApi.login(email, password);

            if (data.error) {
                setError(data.error || "Login Failed");
                setLoading(false);
                return;
            }

            const { access_token, refresh_token } = data;

            // Store tokens
            localStorage.setItem("access_token", access_token);
            localStorage.setItem("refresh_token", refresh_token);

            router.push("/dashboard");
        } catch (err) {
            console.log("Login error:", err);
            setError("Network error");
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg shadow-gray-400">
                <h1 className="mb-2 text-center text-3xl font-bold text-gray-800">
                    Route Management Tool
                </h1>
                <p className="mb-8 text-center text-gray-500">
                    Sign in to your account
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5">
                        <label
                            htmlFor="email"
                            className="text-sm font-semibold text-gray-700"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="rounded-md border border-gray-300 px-4 py-2.5 text-gray-800 placeholder-gray-400 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-300"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label
                            htmlFor="password"
                            className="text-sm font-semibold text-gray-700"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="rounded-md border border-gray-300 px-4 py-2.5 text-gray-800 placeholder-gray-400 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-300"
                        />
                    </div>

                    {error && (
                        <p className="text-sm font-medium text-red-500">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 rounded-md bg-gray-800 px-4 py-2.5 font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    );
}
