import { withAuth } from "next-auth/middleware";

export default withAuth(
    function middleware(req) {
        // Ici tu peux ajouter de la logique supplémentaire si besoin
        console.log("Middleware executed for:", req.nextUrl.pathname);
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