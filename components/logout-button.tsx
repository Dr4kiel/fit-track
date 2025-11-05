"use client";

import { signOut } from "next-auth/react";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
    const handleLogout = () => {
        signOut({ callbackUrl: "/" });
    };

    return (
        <SidebarMenuButton onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            <span>Se déconnecter</span>
        </SidebarMenuButton>
    );
}