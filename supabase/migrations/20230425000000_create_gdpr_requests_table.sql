
-- Create GDPR requests table
CREATE TABLE IF NOT EXISTS public.gdpr_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    request_type TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL, -- pending, in_progress, completed, rejected
    admin_notes TEXT,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Add RLS policies
ALTER TABLE public.gdpr_requests ENABLE ROW LEVEL SECURITY;

-- Add trigger for updated_at
CREATE TRIGGER update_gdpr_requests_updated_at
BEFORE UPDATE ON public.gdpr_requests
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add policy for admin users
CREATE POLICY "Allow admins full access to gdpr_requests"
ON public.gdpr_requests
USING (
  (SELECT has_role(auth.uid(), 'admin'))
)
WITH CHECK (
  (SELECT has_role(auth.uid(), 'admin'))
);

-- Add policy for users to insert their own requests
CREATE POLICY "Allow users to insert their own GDPR requests"
ON public.gdpr_requests
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Add policy for users to view their own requests
CREATE POLICY "Allow users to view their own GDPR requests"
ON public.gdpr_requests
FOR SELECT
TO authenticated
USING (email = auth.jwt() ->> 'email');
