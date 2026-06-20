const { createClient } = require('@supabase/supabase-js')

// Get URL and SERVICE_ROLE_KEY from env
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Erreur: NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définis dans .env.local')
  console.error('Assurez-vous d\'avoir ajouté SUPABASE_SERVICE_ROLE_KEY dans votre fichier .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const categories = [
  { name: 'Séries Sénégalaises' },
  { name: 'Drames' },
  { name: 'Comédies Locales' },
  { name: 'Thrillers' }
]

const movies = [
  {
    title: 'Karma',
    slug: 'karma',
    synopsis: 'Karma relate l’histoire de jeunes filles confrontées aux réalités de la vie dakaroise, entre trahison, amour, jalousie et drames.',
    thumbnail_url: 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?q=80&w=1000&auto=format&fit=crop', // Placeholder for african women
    video_url: 'https://www.youtube.com/watch?v=placeholder',
    premium: true
  },
  {
    title: 'Maitresse d\'un homme marié',
    slug: 'maitresse-dun-homme-marie',
    synopsis: 'Une série qui brise les tabous sur la sexualité, la polygamie, et la condition de la femme au Sénégal à travers les vies croisées de plusieurs femmes.',
    thumbnail_url: 'https://images.unsplash.com/photo-1531123414780-f74242c2b052?q=80&w=1000&auto=format&fit=crop', // Placeholder for confident african woman
    video_url: 'https://www.youtube.com/watch?v=placeholder',
    premium: true
  },
  {
    title: 'Wiri Wiri',
    slug: 'wiri-wiri',
    synopsis: 'Les aventures rocambolesques de Jojo et Soumboulou dans cette série théâtrale devenue un phénomène national.',
    thumbnail_url: 'https://images.unsplash.com/photo-1535443274868-756b0f070b6e?q=80&w=1000&auto=format&fit=crop',
    video_url: 'https://www.youtube.com/watch?v=placeholder',
    premium: false
  },
  {
    title: 'Golden',
    slug: 'golden',
    synopsis: 'Plongée dans le milieu impitoyable des affaires, des luttes de pouvoir et des secrets de famille au sein de la haute bourgeoisie sénégalaise.',
    thumbnail_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=1000&auto=format&fit=crop',
    video_url: 'https://www.youtube.com/watch?v=placeholder',
    premium: false
  },
  {
    title: 'Idoles',
    slug: 'idoles',
    synopsis: 'Le monde tumultueux de la presse sénégalaise, ses scandales politiques, ses journalistes engagés et ses hommes de l\'ombre.',
    thumbnail_url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=1000&auto=format&fit=crop',
    video_url: 'https://www.youtube.com/watch?v=placeholder',
    premium: true
  }
]

async function seed() {
  console.log('Début du seeding de la base de données...')

  // 1. Insert Categories
  console.log('Insertion des catégories...')
  const { data: insertedCategories, error: catError } = await supabase
    .from('categories')
    .upsert(categories, { onConflict: 'name' })
    .select()

  if (catError) {
    console.error('Erreur lors de l\'insertion des catégories:', catError)
    return
  }
  console.log(`${insertedCategories.length} catégories insérées.`)

  // Map category names to IDs
  const categoryMap = {}
  insertedCategories.forEach(cat => {
    categoryMap[cat.name] = cat.id
  })

  // 2. Assign categories to movies
  const moviesWithCategories = movies.map((movie, index) => {
    // Assign a random category or specifically
    let catId
    if (index < 2) catId = categoryMap['Action & Aventure']
    else if (index < 4) catId = categoryMap['Science-Fiction']
    else catId = categoryMap['Drames']

    return {
      ...movie,
      category_id: catId
    }
  })

  // 3. Insert Movies
  console.log('Insertion des films...')
  const { error: moviesError } = await supabase
    .from('movies')
    .upsert(moviesWithCategories, { onConflict: 'slug' })

  if (moviesError) {
    console.error('Erreur lors de l\'insertion des films:', moviesError)
    return
  }
  
  console.log('Seeding terminé avec succès !')
}

seed()
