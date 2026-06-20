import { Play, Info } from 'lucide-react'

export default function Hero({ movie }: { movie: any }) {
  if (!movie) return null

  return (
    <div className="h-[70vh] md:h-[85vh] w-full relative">
      <div className="absolute w-full h-full">
        {/* Replace this img with a real banner from DB, but for now we use thumbnail_url */}
        <img 
          src={movie.thumbnail_url || '/hero-bg.png'} 
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
      </div>

      <div className="absolute top-[30%] md:top-[40%] ml-4 md:ml-12 max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg mb-4">
          {movie.title}
        </h1>
        <p className="text-white text-lg md:text-xl drop-shadow-md mb-8 line-clamp-3">
          {movie.synopsis}
        </p>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-2 md:py-3 bg-primary text-black font-bold rounded hover:bg-primary-hover transition">
            <Play className="w-5 h-5 md:w-7 md:h-7 fill-current" />
            Lecture
          </button>
          <button className="flex items-center gap-2 px-6 py-2 md:py-3 bg-[#6d6d6eb3] text-white font-bold rounded hover:bg-[#6d6d6e66] transition">
            <Info className="w-5 h-5 md:w-7 md:h-7" />
            Plus d'infos
          </button>
        </div>
      </div>
    </div>
  )
}
