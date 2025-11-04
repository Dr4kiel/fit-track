import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Suspense } from "react"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Activity, LayoutDashboard, BarChart3, Settings, LogOut } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "FitTrack - Suivi d'activités",
  description: "Application de suivi d'activités physiques",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`antialiased`}>
      <body className="font-mono">
        <Suspense>
          <SidebarProvider>
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
                    <SidebarMenuButton asChild>
                      <Link href="/">
                        <LogOut className="h-4 w-4" />
                        <span>Se déconnecter</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarFooter>
            </Sidebar>
            <SidebarInset>
              <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4">
                <SidebarTrigger />
              </header>
              {children}
            </SidebarInset>
          </SidebarProvider>
        </Suspense>
      </body>
    </html>
  )
}
