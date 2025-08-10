-- Run this SQL in your Supabase SQL Editor to create a keep-alive function
-- This ensures the workflow has a reliable endpoint to call

CREATE OR REPLACE FUNCTION keep_alive()
RETURNS json
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT json_build_object(
    'status', 'alive',
    'timestamp', now(),
    'message', 'Database is active'
  );
$$;