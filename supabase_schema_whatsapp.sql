-- Add click tracking to products
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS whatsapp_clicks INTEGER DEFAULT 0;

-- Create Product Variants table for detailed stock management
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    size TEXT,
    color TEXT,
    stock_status TEXT CHECK (stock_status IN ('in_stock', 'sold_out', 'low_stock')) DEFAULT 'in_stock',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS for variants
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- Policies for variants (public read, admin write)
CREATE POLICY "Public variants are viewable by everyone" 
ON public.product_variants FOR SELECT 
USING (true);

CREATE POLICY "Admin can insert variants" 
ON public.product_variants FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Admin can update variants" 
ON public.product_variants FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Admin can delete variants" 
ON public.product_variants FOR DELETE 
TO authenticated 
USING (true);

-- Create Sales Ledger table for manual recording
CREATE TABLE IF NOT EXISTS public.sales_ledger (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_name TEXT NOT NULL,
    customer_name TEXT,
    customer_phone TEXT,
    price_sold DECIMAL(10,2),
    sale_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS for ledger
ALTER TABLE public.sales_ledger ENABLE ROW LEVEL SECURITY;

-- Policies for ledger (admin only)
CREATE POLICY "Admin can view ledger" 
ON public.sales_ledger FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Admin can manage ledger" 
ON public.sales_ledger FOR ALL 
TO authenticated 
USING (true);

-- Update site settings keys (no schema change needed, handled via existing key-value table)
-- We will add keys: 'whatsapp_template', 'whatsapp_agent_rotation' via the API/UI
