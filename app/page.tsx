import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Activity, TrendingUp, Target, Calendar } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">FitTrack</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/connexion">
              <Button variant="ghost">Connexion</Button>
            </Link>
            <Link href="/inscription">
              <Button>Commencer</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight text-balance">
              Suivez vos activités physiques avec précision
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              Atteignez vos objectifs de fitness avec un suivi personnalisé de vos entraînements, votre poids et vos
              progrès.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/inscription">
                <Button size="lg" className="text-lg px-8 py-6">
                  Commencer gratuitement
                </Button>
              </Link>
              <Link href="/connexion">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent">
                  Se connecter
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-secondary py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
              Tout ce dont vous avez besoin
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-card p-8 rounded-lg shadow-md">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-card-foreground">Suivi des activités</h3>
                <p className="text-muted-foreground">
                  Enregistrez vos courses, séances de musculation, étirements et plus encore.
                </p>
              </div>
              <div className="bg-card p-8 rounded-lg shadow-md">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-card-foreground">Analyse des progrès</h3>
                <p className="text-muted-foreground">
                  Visualisez votre évolution avec des graphiques détaillés et des statistiques.
                </p>
              </div>
              <div className="bg-card p-8 rounded-lg shadow-md">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-card-foreground">Calendrier intelligent</h3>
                <p className="text-muted-foreground">
                  Planifiez vos entraînements et suivez votre régularité au quotidien.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 FitTrack. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}
