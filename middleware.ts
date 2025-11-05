import { withAuth } from "next-auth/middleware";

export default withAuth(
    function middleware(req) {
        // redirection automatique gérée par next-auth
    },
    {
        callbacks: {
            authorized: ({ token }) => {
                // Retourne true si l'utilisateur est autorisé à accéder à la page
                return !!token;
            },
        },
    }
);

// Spécifie les routes à protéger
export const config = {
    matcher: [
        "/dashboard/:path*",
        "/activites/:path*",
        "/statut/:path*",
        "/api/users/:path*",
        // Ajoute d'autres routes protégées ici
    ],
};