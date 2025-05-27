
-- RLS Policies for go4

-- Enable RLS
ALTER TABLE corporate_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;

-- Corporate Accounts: allow users to see only their company
CREATE POLICY "Allow access to own corporate account"
ON corporate_accounts FOR SELECT USING (
  id = (SELECT corporate_id FROM users WHERE users.id = auth.uid())
);

-- Users: allow each user to access their own data
CREATE POLICY "Users can access their own profile"
ON users FOR SELECT USING (
  id = auth.uid()
);

-- User Roles: allow user to view their own role
CREATE POLICY "View own role"
ON user_roles FOR SELECT USING (
  user_id = auth.uid()
);

-- Licenses: allow access to license info of their corporate account
CREATE POLICY "Access own licenses"
ON licenses FOR SELECT USING (
  corporate_id = (SELECT corporate_id FROM users WHERE id = auth.uid())
);
