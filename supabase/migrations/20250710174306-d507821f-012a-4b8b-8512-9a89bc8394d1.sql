
-- Create shared_links table for file sharing functionality
CREATE TABLE public.shared_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_id UUID REFERENCES public.uploaded_files(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  permissions TEXT NOT NULL CHECK (permissions IN ('view', 'download')),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.shared_links ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can create shared links for their own files only
CREATE POLICY "Users can create shared links for their own files" 
  ON public.shared_links 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = user_id AND 
    EXISTS (
      SELECT 1 FROM public.uploaded_files 
      WHERE id = file_id AND user_id = auth.uid()
    )
  );

-- RLS Policy: Users can view/manage their own shared links
CREATE POLICY "Users can manage their own shared links" 
  ON public.shared_links 
  FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policy: Allow anonymous access to valid, non-expired shared links for public sharing
CREATE POLICY "Anonymous access to valid shared links" 
  ON public.shared_links 
  FOR SELECT 
  USING (
    expires_at IS NULL OR expires_at > NOW()
  );

-- Create an index for better performance on shared link lookups
CREATE INDEX idx_shared_links_file_id ON public.shared_links(file_id);
CREATE INDEX idx_shared_links_expires_at ON public.shared_links(expires_at);
