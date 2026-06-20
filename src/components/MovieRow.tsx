export default function MovieRow({ title, movies }: { title: string, movies: any[] }) {
  if (!movies || movies.length === 0) return null

  return (
    <div className="px-4 md:px-12 mt-8">
      <h2 className="text-white text-xl md:text-2xl font-bold mb-4">
        {title}
      </h2>
      <div className="flex overflow-x-scroll gap-4 pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {movies.map((movie) => (
          <div 
            key={movie.id} 
            className="flex-none w-[160px] md:w-[240px] aspect-video relative group cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-10"
          >
            <img
              src={movie.thumbnail_url}
              alt={movie.title}
              className="w-full h-full object-cover rounded shadow-md"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-sm font-bold truncate">{movie.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
