import { Mail } from "lucide-react";

export default function PersonalInfoCard() {
    return (
        <div className="flex flex-col gap-2 justify-between rounded-xl bg-card border border-border">
            <div className="flex items-center gap-2 pt-7 pl-7 text-lg font-semibold">
                <Mail size={21} className="text-primary-foreground" />
                Personal Information
            </div>
            <p className="pl-7 text-sm text-muted-foreground">
                Update your personal details
            </p>

            <div className="flex items-center gap-6 pl-7 pb-7 pt-5"></div>
        </div>
    );
}
