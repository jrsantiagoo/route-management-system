"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

        // Simulate login delay, then navigate to dashboard
        await new Promise((r) => setTimeout(r, 800));
        router.push("/dashboard");
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
