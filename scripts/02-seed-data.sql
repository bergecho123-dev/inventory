-- Insert default admin user (password: admin123)
INSERT INTO users (name, email, password_hash, role, is_active)
VALUES (
  'Admin User',
  'admin@amesob.gov.et',
  '$2b$10$YourHashedPasswordHere', -- Replace with actual bcrypt hash
  'admin',
  true
) ON CONFLICT (email) DO NOTHING;

-- Insert sample store manager
INSERT INTO users (name, email, password_hash, role, is_active)
VALUES (
  'Store Manager',
  'manager@amesob.gov.et',
  '$2b$10$YourHashedPasswordHere',
  'store_manager',
  true
) ON CONFLICT (email) DO NOTHING;

-- Insert sample employee
INSERT INTO users (name, email, password_hash, role, is_active)
VALUES (
  'Employee User',
  'employee@amesob.gov.et',
  '$2b$10$YourHashedPasswordHere',
  'employee',
  true
) ON CONFLICT (email) DO NOTHING;

-- Insert sample inventory items
INSERT INTO inventory_items (name, category, quantity, unit, location, added_by, updated_by)
SELECT 'Office Supplies - Pens', 'Office Supplies', 500, 'Box', 'Warehouse A', id, id
FROM users WHERE email = 'admin@amesob.gov.et'
ON CONFLICT DO NOTHING;

INSERT INTO inventory_items (name, category, quantity, unit, location, added_by, updated_by)
SELECT 'Computers - Desktop', 'Equipment', 25, 'Unit', 'IT Room', id, id
FROM users WHERE email = 'admin@amesob.gov.et'
ON CONFLICT DO NOTHING;

INSERT INTO inventory_items (name, category, quantity, unit, location, added_by, updated_by)
SELECT 'Furniture - Chairs', 'Furniture', 100, 'Unit', 'Storage', id, id
FROM users WHERE email = 'admin@amesob.gov.et'
ON CONFLICT DO NOTHING;
