"use client";

import { useSession } from "next-auth/react";
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarFooter,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Activity, LayoutDashboard, BarChart3, Settings } from "lucide-react";
import Link from "next/link";
import LogoutButton from "@/components/logout-button";

export default function AppSidebar() {
    const { data: session } = useSession();

    // Ne pas afficher la sidebar si l'utilisateur n'est pas connecté
    if (!session) {
        return null;
    }

    const items = [
        { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
        { href: "/statut", label: "Statistiques", icon: BarChart3 },
        { href: "/activites/modifier", label: "Modifier activités", icon: Settings },
    ];

    return (
        <Sidebar>
            <SidebarHeader className="border-b border-sidebar-border">
                <div className="flex items-center gap-3 px-2 py-2">
                    <Activity className="h-6 w-6 text-sidebar-primary" />
                    <span className="text-lg font-bold">FitTrack</span>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu className="space-y-1 py-4 px-2 gap-3">
                    {items.map((item) => (
                        <SidebarMenuItem key={item.href} className="px-2">
                            <SidebarMenuButton asChild>
                                <Link href={item.href}>
                                    <item.icon className="h-4 w-4" />
                                    <span>{item.label}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="border-t border-sidebar-border">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <LogoutButton />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}