
-- Create quick calculator tiles table
CREATE TABLE IF NOT EXISTS public.quick_calculator_tiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    value TEXT NOT NULL,
    label TEXT NOT NULL,
    price_per_sqm NUMERIC NOT NULL DEFAULT 45.0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add initial data with some common tile formats
INSERT INTO public.quick_calculator_tiles (value, label, price_per_sqm)
VALUES
    ('30x30', '30x30 cm', 41.0),
    ('60x60', '60x60 cm', 52.0),
    ('120x120', '120x120 cm', 110.0),
    ('parket', 'Parket tegels', 71.0);

-- Add row level security
ALTER TABLE public.quick_calculator_tiles ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to read
CREATE POLICY quick_calculator_tiles_select_policy
    ON public.quick_calculator_tiles
    FOR SELECT
    TO authenticated
    USING (true);

-- Create policy for authenticated users to insert/update/delete
CREATE POLICY quick_calculator_tiles_all_policy
    ON public.quick_calculator_tiles
    FOR ALL
    TO authenticated
    USING (true);

-- Also allow anon users to read tile options (needed for public calculator)
CREATE POLICY quick_calculator_tiles_anon_select_policy
    ON public.quick_calculator_tiles
    FOR SELECT
    TO anon
    USING (true);
