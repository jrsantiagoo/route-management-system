import Sidebar from "@/components/sidebar";

// This layout wraps all protected pages (Dashboard, Route Tool, Assignment).
export default function protectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            <Sidebar />

            <main className="ml-64 min-h-screen p-8 bg-gray-100">
                {children}
            </main>
        </div>
    );
}
