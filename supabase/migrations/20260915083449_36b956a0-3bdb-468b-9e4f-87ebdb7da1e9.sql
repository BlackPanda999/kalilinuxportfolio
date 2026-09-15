CREATE TABLE public.site_incidents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kind TEXT NOT NULL DEFAULT 'runtime',
  message TEXT NOT NULL,
  stack TEXT,
  path TEXT,
  user_agent TEXT,
  severity TEXT NOT NULL DEFAULT 'warning',
  auto_action TEXT,
  diagnosis TEXT,
  status TEXT NOT NULL DEFAULT 'healed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.site_incidents TO anon;
GRANT SELECT, INSERT ON public.site_incidents TO authenticated;
GRANT ALL ON public.site_incidents TO service_role;

ALTER TABLE public.site_incidents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read the health log" ON public.site_incidents FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can report an incident" ON public.site_incidents FOR INSERT TO anon, authenticated WITH CHECK (char_length(message) <= 2000 AND char_length(coalesce(stack, '')) <= 6000);

CREATE INDEX site_incidents_created_at_idx ON public.site_incidents (created_at DESC);