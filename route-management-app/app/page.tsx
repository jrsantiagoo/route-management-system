import Link from "next/dist/client/link";

// It currently only contains a link to the dashboard page
// TODO: Implement actual login functionality and authentication
export default function LoginPage() {
    return (
        <div className="flex flex-col min-h-screen items-center justify-center place-items-center">
            <h1 className="text-4xl p-6 font-bold"> This is the Login Page</h1>

            {/* Login form placeholder */}
            <div className="flex flex-col gap-6 font-bold">
                <Link
                    href="/dashboard"
                    className="p-10 rounded-lg bg-gray-300 shadow-lg shadow-gray-600 text-gray-800 hover:shadow-gray-700 hover:bg-gray-400 hover:text-gray-900"
                >
                    {" "}
                    Go To Dashboard{" "}
                </Link>
            </div>
        </div>
    );
}
