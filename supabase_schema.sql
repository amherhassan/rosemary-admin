-- Create table for categories
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    image_url TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create table for products
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'LKR',
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    images TEXT[] DEFAULT '{}',
    is_new BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    sizes TEXT[] DEFAULT '{}',
    colors TEXT[] DEFAULT '{}',
    show_price BOOLEAN DEFAULT true,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create table for hero sections
CREATE TABLE IF NOT EXISTS public.hero_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    cta_text TEXT,
    cta_link TEXT,
    bg_image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create table for promotions
CREATE TABLE IF NOT EXISTS public.promotions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    description TEXT,
    image_url TEXT,
    link TEXT,
    is_active BOOLEAN DEFAULT true,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create table for site settings
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create table for page SEO
CREATE TABLE IF NOT EXISTS public.page_seo (
    page_slug TEXT PRIMARY KEY,
    meta_title TEXT,
    meta_description TEXT,
    og_image_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_seo ENABLE ROW LEVEL SECURITY;

-- Create Policies for Public Access (Read Only Active)
CREATE POLICY "Allow public read-only for categories" ON public.categories FOR SELECT TO public USING (true);
CREATE POLICY "Allow public read-only for active products" ON public.products FOR SELECT TO public USING (status = 'active');
CREATE POLICY "Allow public read-only for active hero" ON public.hero_sections FOR SELECT TO public USING (is_active = true);
CREATE POLICY "Allow public read-only for active promotions" ON public.promotions FOR SELECT TO public USING (is_active = true);
CREATE POLICY "Allow public read-only for settings" ON public.site_settings FOR SELECT TO public USING (true);
CREATE POLICY "Allow public read-only for seo" ON public.page_seo FOR SELECT TO public USING (true);

-- Create Policies for Service Role (Admin full access)
-- Note: Supabase UI handles this differently, but for scripting purposes:
-- Authenticated users (admins) can do everything
CREATE POLICY "Allow all actions for authenticated users" ON public.categories FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all actions for authenticated users" ON public.products FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all actions for authenticated users" ON public.hero_sections FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all actions for authenticated users" ON public.promotions FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all actions for authenticated users" ON public.site_settings FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all actions for authenticated users" ON public.page_seo FOR ALL TO authenticated USING (true);
