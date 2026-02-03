-- Fix the missing participant record for contract 0xd3A9E1754ecBa68859186d8e5dc25e6564672DC6

-- Insert the creator (owner)
INSERT INTO contract_participants (contract_id, user_address, role)
VALUES (
  'a0b9c548-f17a-4c8b-b6d1-ec9745d7883b',
  '0x55a52dcf57daa06059ec9f2e7e7e7a5c50534e0a',
  'owner'
)
ON CONFLICT (contract_id, user_address, role) DO NOTHING;

-- Insert the recipient (you!)
INSERT INTO contract_participants (contract_id, user_address, role)
VALUES (
  'a0b9c548-f17a-4c8b-b6d1-ec9745d7883b',
  '0xd4145dfa61972968bedf626d03a453f9a60de003',
  'recipient'
)
ON CONFLICT (contract_id, user_address, role) DO NOTHING;

-- Verify the fix
SELECT
  cp.user_address,
  cp.role,
  c.contract_address,
  c.template_id
FROM contract_participants cp
JOIN contracts c ON c.id = cp.contract_id
WHERE c.contract_address = '0xd3A9E1754ecBa68859186d8e5dc25e6564672DC6';
