-- Fix function search path for generate_ticket_number
CREATE OR REPLACE FUNCTION public.generate_ticket_number()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.ticket_number := 'TKT-' || LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0');
  RETURN NEW;
END;
$$;

-- Fix function search path for update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;