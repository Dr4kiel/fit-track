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

    return (
        <Sidebar>
            <SidebarHeader className="border-b border-sidebar-border">
                <div className="flex items-center gap-2 px-2 py-2">
                    <Activity className="h-6 w-6 text-sidebar-primary" />
                    <span className="text-lg font-bold">FitTrack</span>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href="/dashboard">
                                <LayoutDashboard className="h-4 w-4" />
                                <span>Tableau de bord</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href="/statut">
                                <BarChart3 className="h-4 w-4" />
                                <span>Statistiques</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href="/activites/modifier">
                                <Settings className="h-4 w-4" />
                                <span>Modifier activités</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
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