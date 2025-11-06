import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const { pathname } = req.nextUrl;
        const isAuthenticated = !!req.nextauth.token;

        // Rediriger les utilisateurs connectés depuis les pages de connexion
        if (isAuthenticated && (pathname === '/connexion' || pathname === '/inscription' || pathname === '/')) {
            return NextResponse.redirect(new URL('/dashboard', req.url));
        }

        // Redirection automatique pour les pages protégées gérée par next-auth
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl;

                // Permettre l'accès aux pages publiques même si connecté
                if (pathname === '/connexion' || pathname === '/inscription' || pathname === '/') {
                    return true;
                }

                // Pour les pages protégées, vérifier le token
                return !!token;
            },
        },
    }
);

// Spécifie les routes à protéger
export const config = {
    matcher: [
        "/",
        "/connexion",
        "/inscription",
        "/dashboard/:path*",
        "/activites/:path*",
        "/statut/:path*",
        "/api/users/:path*",
        // Ajoute d'autres routes protégées ici
    ],
};