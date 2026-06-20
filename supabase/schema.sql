-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'subscriber', 'visitor');
CREATE TYPE subscription_plan AS ENUM ('weekly', 'monthly', 'quarterly', 'yearly');
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'expired', 'past_due');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed');
CREATE TYPE content_type AS ENUM ('movie', 'episode');

-- Users table (Extends Supabase Auth users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT UNIQUE NOT NULL,
  role user_role DEFAULT 'visitor'::user_role,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  plan subscription_plan NOT NULL,
  status subscription_status DEFAULT 'active'::subscription_status,
  start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Movies table
CREATE TABLE public.movies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  synopsis TEXT,
  thumbnail_url TEXT,
  trailer_url TEXT,
  video_url TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  release_date DATE,
  premium BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Series table
CREATE TABLE public.series (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  synopsis TEXT,
  thumbnail_url TEXT,
  premium BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seasons table
CREATE TABLE public.seasons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  series_id UUID REFERENCES public.series(id) ON DELETE CASCADE,
  season_number INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Episodes table
CREATE TABLE public.episodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  season_id UUID REFERENCES public.seasons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  episode_number INTEGER NOT NULL,
  video_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method TEXT,
  transaction_id TEXT UNIQUE,
  status payment_status DEFAULT 'pending'::payment_status,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Watch History table
CREATE TABLE public.watch_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  content_type content_type NOT NULL,
  content_id UUID NOT NULL, -- Can refer to a movie or an episode
  progress INTEGER DEFAULT 0, -- In seconds
  last_watched TIMESTAMPTZ DEFAULT NOW()
);

-- Create a function to automatically create a user profile after Supabase Auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'visitor');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function after a user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Row Level Security (RLS) setup

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.series ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_history ENABLE ROW LEVEL SECURITY;

-- Basic Read Policies (Allow anyone to read movies, series, seasons, episodes, categories)
CREATE POLICY "Public read access for movies" ON public.movies FOR SELECT USING (true);
CREATE POLICY "Public read access for series" ON public.series FOR SELECT USING (true);
CREATE POLICY "Public read access for seasons" ON public.seasons FOR SELECT USING (true);
CREATE POLICY "Public read access for episodes" ON public.episodes FOR SELECT USING (true);
CREATE POLICY "Public read access for categories" ON public.categories FOR SELECT USING (true);

-- User Policies (Users can read/update their own data)
CREATE POLICY "Users can view own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Subscriptions Policies (Users can view their own subscriptions)
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Payments Policies (Users can view their own payments)
CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);

-- Watch History (Users can manage their own watch history)
CREATE POLICY "Users can manage own watch history" ON public.watch_history FOR ALL USING (auth.uid() = user_id);
