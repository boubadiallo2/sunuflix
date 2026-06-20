import { createClient } from '@/utils/supabase/server'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import MovieRow from '@/components/MovieRow'

export default async function Home() {
  const supabase = await createClient()

  // Get user session
  const { data: { user } } = await supabase.auth.getUser()

  // Get categories and movies
  const { data: categories } = await supabase.from('categories').select('*')
  const { data: movies } = await supabase.from('movies').select('*').order('created_at', { ascending: false })

  // Pick a featured movie (the newest one)
  const featuredMovie = movies && movies.length > 0 ? movies[0] : null

  return (
    <main className="min-h-screen bg-[#141414] pb-24">
      <Navbar user={user} />
      
      <Hero movie={featuredMovie} />

      <div className="-mt-16 md:-mt-32 relative z-20">
        {categories?.map((category) => {
          const categoryMovies = movies?.filter(m => m.category_id === category.id) || []
          if (categoryMovies.length === 0) return null
          
          return (
            <MovieRow 
              key={category.id} 
              title={category.name} 
              movies={categoryMovies} 
            />
          )
        })}

        {/* Fallback if no categories or movies */}
        {(!categories || categories.length === 0) && movies && movies.length > 0 && (
          <MovieRow title="Tous les films" movies={movies} />
        )}
        
        {(!movies || movies.length === 0) && (
          <div className="px-12 mt-32 text-center text-gray-500">
            <p className="mb-4">Bienvenue sur Sunuflix !</p>
            <p className="text-sm">Exécutez `node --env-file=.env.local scripts/seed.js` (après avoir ajouté votre SUPABASE_SERVICE_ROLE_KEY dans .env.local) pour ajouter du contenu de test.</p>
          </div>
        )}
      </div>
    </main>
  )
}
