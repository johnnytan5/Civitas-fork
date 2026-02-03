-- Multi-template contracts table
-- Stores all contract types (rent_vault, group_buy_escrow, stable_allowance_treasury)

CREATE TABLE IF NOT EXISTS contracts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_address VARCHAR(42) UNIQUE NOT NULL,
  template_id VARCHAR(30) NOT NULL,
  creator_address VARCHAR(42) NOT NULL,
  chain_id INTEGER NOT NULL DEFAULT 8453,
  state INTEGER NOT NULL DEFAULT 0,
  basename VARCHAR(100),
  config JSONB NOT NULL,
  on_chain_state JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  last_synced_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_contracts_creator ON contracts (creator_address);
CREATE INDEX IF NOT EXISTS idx_contracts_template ON contracts (template_id);
CREATE INDEX IF NOT EXISTS idx_contracts_state ON contracts (state);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_contracts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_contracts_updated_at ON contracts;
CREATE TRIGGER trg_contracts_updated_at
  BEFORE UPDATE ON contracts
  FOR EACH ROW
  EXECUTE FUNCTION update_contracts_updated_at();

-- RLS policies
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "contracts_select_all" ON contracts
  FOR SELECT
  USING (true);

-- Service role write access (backend only)
CREATE POLICY "contracts_insert_service" ON contracts
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "contracts_update_service" ON contracts
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- NOTE: rental_contracts table is kept for backward compatibility (not dropped)
