'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { logout } from '@/app/auth/actions'
import { Search, Bell, User } from 'lucide-react'

export default function Navbar({ user }: { user: any }) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed w-full z-50 top-0 transition-colors duration-300 ${isScrolled ? 'bg-[#141414]' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
      <div className="px-4 md:px-12 flex items-center justify-between py-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-primary text-2xl md:text-3xl font-bold tracking-tight">
            SUNUFLIX
          </Link>
          <ul className="hidden md:flex gap-4 text-sm text-[#e5e5e5]">
            <li><Link href="/" className="hover:text-primary transition">Accueil</Link></li>
            <li><Link href="/series" className="hover:text-primary transition">Séries</Link></li>
            <li><Link href="/films" className="hover:text-primary transition">Films</Link></li>
            <li><Link href="/nouveautes" className="hover:text-primary transition">Nouveautés</Link></li>
            <li><Link href="/ma-liste" className="hover:text-primary transition">Ma liste</Link></li>
          </ul>
        </div>
        
        <div className="flex items-center gap-6 text-white">
          <Search className="w-5 h-5 cursor-pointer hidden sm:block" />
          <span className="text-sm hidden sm:block">Jeunesse</span>
          <Bell className="w-5 h-5 cursor-pointer" />
          
          <div className="relative group cursor-pointer flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center overflow-hidden">
              <User className="w-5 h-5 text-white" />
            </div>
            
            {/* Dropdown */}
            <div className="absolute right-0 top-8 mt-2 w-48 bg-black/90 border border-[#333] rounded hidden group-hover:flex flex-col py-2">
              {user ? (
                <>
                  <div className="px-4 py-2 text-sm text-gray-300 border-b border-[#333]">
                    {user.email}
                  </div>
                  <button onClick={() => logout()} className="px-4 py-2 text-sm text-left hover:underline">
                    Se déconnecter
                  </button>
                </>
              ) : (
                <Link href="/login" className="px-4 py-2 text-sm hover:underline">
                  S'identifier
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
