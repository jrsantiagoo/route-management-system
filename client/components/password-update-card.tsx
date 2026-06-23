import { Lock } from "lucide-react";

export default function PasswordUpdateCard() {
    return (
        <div className="flex flex-col gap-2 justify-between rounded-xl bg-card border border-border">
            <div className="flex items-center gap-2 pt-7 pl-7 text-lg font-semibold">
                <Lock size={21} className="text-primary-foreground" />
                Change Password
            </div>
            <p className="pl-7 text-sm text-muted-foreground">
                Update your password
            </p>

            <div className="flex items-center gap-6 pl-7 pb-7 pt-5"></div>
        </div>
    );
}
