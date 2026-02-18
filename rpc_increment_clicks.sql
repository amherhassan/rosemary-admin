-- Function to safely increment clicks atomically
CREATE OR REPLACE FUNCTION increment_clicks(row_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE products 
  SET whatsapp_clicks = COALESCE(whatsapp_clicks, 0) + 1
  WHERE id = row_id;
END;
$$ LANGUAGE plpgsql;
