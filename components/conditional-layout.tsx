"use client";

import { useSession } from "next-auth/react";
import { ReactNode } from "react";
import {
    SidebarProvider,
    SidebarInset,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";

interface ConditionalLayoutProps {
    children: ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
    const { data: session, status } = useSession();

    // Pendant le chargement de la session
    if (status === "loading") {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-lg">Chargement...</div>
            </div>
        );
    }

    // Si l'utilisateur n'est pas connecté, afficher sans sidebar
    if (!session) {
        return (
            <main className="min-h-screen">
                {children}
            </main>
        );
    }

    // Si l'utilisateur est connecté, afficher avec sidebar
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b bg-background px-4">
                    <SidebarTrigger />
                </header>
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}