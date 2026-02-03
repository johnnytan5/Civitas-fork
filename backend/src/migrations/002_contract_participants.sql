-- Contract Participants Table Migration
-- Creates a junction table to track all users involved in each contract

-- New table to track all participants in a contract
CREATE TABLE IF NOT EXISTS contract_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  user_address VARCHAR(42) NOT NULL,
  role VARCHAR(20) NOT NULL, -- 'creator', 'recipient', 'tenant', 'participant', 'owner'
  share_bps INTEGER, -- For tenants/participants with shares (basis points)
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_contract_participants_user ON contract_participants (user_address);
CREATE INDEX IF NOT EXISTS idx_contract_participants_contract ON contract_participants (contract_id);
CREATE INDEX IF NOT EXISTS idx_contract_participants_role ON contract_participants (role);

-- Composite index for user + role queries (most common query pattern)
CREATE INDEX IF NOT EXISTS idx_contract_participants_user_role ON contract_participants (user_address, role);

-- Prevent duplicate participant entries
CREATE UNIQUE INDEX IF NOT EXISTS idx_contract_participants_unique
  ON contract_participants (contract_id, user_address, role);

-- RLS policies
ALTER TABLE contract_participants ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "contract_participants_select_all" ON contract_participants
  FOR SELECT
  USING (true);

-- Service role write access (backend only)
CREATE POLICY "contract_participants_insert_service" ON contract_participants
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "contract_participants_update_service" ON contract_participants
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "contract_participants_delete_service" ON contract_participants
  FOR DELETE
  USING (true);

-- Backfill existing contracts with participants
-- This will extract participants from the config JSONB field
DO $$
DECLARE
  contract_record RECORD;
  tenant_address TEXT;
  participant_address TEXT;
  tenant_index INTEGER;
  participant_index INTEGER;
BEGIN
  -- Loop through all existing contracts
  FOR contract_record IN
    SELECT id, template_id, creator_address, config
    FROM contracts
  LOOP
    -- Add creator
    INSERT INTO contract_participants (contract_id, user_address, role)
    VALUES (contract_record.id, contract_record.creator_address, 'creator')
    ON CONFLICT (contract_id, user_address, role) DO NOTHING;

    -- Add template-specific participants
    CASE contract_record.template_id
      WHEN 'RentVault' THEN
        -- Add recipient (landlord)
        IF contract_record.config->>'recipient' IS NOT NULL THEN
          INSERT INTO contract_participants (contract_id, user_address, role)
          VALUES (contract_record.id, contract_record.config->>'recipient', 'recipient')
          ON CONFLICT (contract_id, user_address, role) DO NOTHING;
        END IF;

        -- Add all tenants with their shares
        IF jsonb_typeof(contract_record.config->'tenants') = 'array' THEN
          FOR tenant_index IN 0..(jsonb_array_length(contract_record.config->'tenants') - 1)
          LOOP
            tenant_address := contract_record.config->'tenants'->>tenant_index;
            INSERT INTO contract_participants (contract_id, user_address, role, share_bps)
            VALUES (
              contract_record.id,
              tenant_address,
              'tenant',
              (contract_record.config->'shareBps'->>tenant_index)::INTEGER
            )
            ON CONFLICT (contract_id, user_address, role) DO NOTHING;
          END LOOP;
        END IF;

      WHEN 'GroupBuyEscrow' THEN
        -- Add recipient (purchaser)
        IF contract_record.config->>'recipient' IS NOT NULL THEN
          INSERT INTO contract_participants (contract_id, user_address, role)
          VALUES (contract_record.id, contract_record.config->>'recipient', 'recipient')
          ON CONFLICT (contract_id, user_address, role) DO NOTHING;
        END IF;

        -- Add all participants with their shares
        IF jsonb_typeof(contract_record.config->'participants') = 'array' THEN
          FOR participant_index IN 0..(jsonb_array_length(contract_record.config->'participants') - 1)
          LOOP
            participant_address := contract_record.config->'participants'->>participant_index;
            INSERT INTO contract_participants (contract_id, user_address, role, share_bps)
            VALUES (
              contract_record.id,
              participant_address,
              'participant',
              (contract_record.config->'shareBps'->>participant_index)::INTEGER
            )
            ON CONFLICT (contract_id, user_address, role) DO NOTHING;
          END LOOP;
        END IF;

      WHEN 'StableAllowanceTreasury' THEN
        -- Add owner
        IF contract_record.config->>'owner' IS NOT NULL THEN
          INSERT INTO contract_participants (contract_id, user_address, role)
          VALUES (contract_record.id, contract_record.config->>'owner', 'owner')
          ON CONFLICT (contract_id, user_address, role) DO NOTHING;
        END IF;

        -- Add recipient (beneficiary)
        IF contract_record.config->>'recipient' IS NOT NULL THEN
          INSERT INTO contract_participants (contract_id, user_address, role)
          VALUES (contract_record.id, contract_record.config->>'recipient', 'recipient')
          ON CONFLICT (contract_id, user_address, role) DO NOTHING;
        END IF;

      ELSE
        -- Unknown template, skip
        NULL;
    END CASE;
  END LOOP;

  RAISE NOTICE 'Successfully backfilled contract participants';
END $$;
