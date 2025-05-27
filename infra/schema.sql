
-- REAL SQL schema for go4

-- 1. Corporate Accounts
CREATE TABLE IF NOT EXISTS corporate_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  domain TEXT,
  license_count INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- 2. Users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  corporate_id UUID REFERENCES corporate_accounts(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT now()
);

-- 3. User Roles
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('Owner', 'Collaborator', 'Viewer')) NOT NULL
);

-- 4. Licenses
CREATE TABLE IF NOT EXISTS licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  corporate_id UUID REFERENCES corporate_accounts(id) ON DELETE CASCADE,
  active_count INTEGER DEFAULT 0,
  max_licenses INTEGER NOT NULL
);
