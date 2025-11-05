import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Suspense } from "react"
import AuthProvider from "@/components/auth-provider"
import ConditionalLayout from "@/components/conditional-layout"

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
        <AuthProvider>
          <Suspense>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  )
}
