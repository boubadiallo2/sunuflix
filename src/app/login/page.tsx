import { login, signup } from '@/app/auth/actions'
import Link from 'next/link'

export default async function LoginPage(props: {
  searchParams: Promise<{ message: string }>
}) {
  const searchParams = await props.searchParams;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-black/80 bg-blend-overlay relative"
         style={{ backgroundImage: "url('/hero-bg.png')" }}
    >
      <div className="absolute top-0 left-0 p-6">
        <Link href="/" className="text-primary text-4xl font-bold tracking-tight">
          SUNUFLIX
        </Link>
      </div>

      <div className="bg-black/70 p-12 rounded-md w-full max-w-[450px] z-10">
        <h1 className="text-3xl font-bold mb-8 text-white">S'identifier</h1>
        
        <form className="flex flex-col gap-4">
          <input
            name="email"
            type="email"
            placeholder="E-mail ou numéro de téléphone"
            className="p-4 bg-[#333] text-white rounded outline-none focus:bg-[#444] transition-colors"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Mot de passe"
            className="p-4 bg-[#333] text-white rounded outline-none focus:bg-[#444] transition-colors"
            required
          />

          {searchParams?.message && (
            <div className="text-[#e87c03] bg-[#e87c03]/10 p-3 rounded text-sm mb-4">
              {searchParams.message}
            </div>
          )}

          <button
            formAction={login}
            className="bg-primary hover:bg-primary-hover text-white p-4 rounded font-bold mt-4 transition-colors"
          >
            S'identifier
          </button>
          
          <div className="flex justify-between items-center text-[#b3b3b3] text-sm mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-[#737373] bg-[#737373] border-none rounded-sm" />
              Se souvenir de moi
            </label>
            <a href="#" className="hover:underline">Besoin d'aide ?</a>
          </div>

          <div className="mt-16 text-[#737373]">
            Première fois sur Sunuflix ?{' '}
            <button formAction={signup} className="text-white hover:underline cursor-pointer">
              Inscrivez-vous maintenant.
            </button>
          </div>
          
          <div className="mt-4 text-xs text-[#8c8c8c]">
            Cette page est protégée par Google reCAPTCHA pour s'assurer que vous n'êtes pas un robot.
          </div>
        </form>
      </div>
    </div>
  )
}
