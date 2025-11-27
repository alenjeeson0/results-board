-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create results table for competition results
CREATE TABLE public.results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id TEXT NOT NULL,
  participant_name TEXT NOT NULL,
  event TEXT NOT NULL,
  category TEXT NOT NULL,
  rank INTEGER,
  time TEXT,
  points INTEGER,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (anyone can view results)
CREATE POLICY "Results are publicly viewable"
ON public.results
FOR SELECT
USING (true);

-- Create policy for admin insert/update/delete
CREATE POLICY "Admins can manage results"
ON public.results
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- Create index for faster searches
CREATE INDEX idx_results_participant_id ON public.results(participant_id);
CREATE INDEX idx_results_event ON public.results(event);
CREATE INDEX idx_results_category ON public.results(category);

-- Create trigger for updated_at
CREATE TRIGGER update_results_updated_at
BEFORE UPDATE ON public.results
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();