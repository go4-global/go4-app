import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";

const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserAndRole = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push("/login");
        return;
      }

      const { user } = session;
      setUser(user);

      const { data, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (roleError) {
        console.error("Error fetching user role:", roleError.message);
        setRole(null);
      } else {
        setRole(data?.role || null);
      }

      setLoading(false);
    };

    getUserAndRole();
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome to Go4</h1>
      <p>User: {user?.email}</p>
      <p>Role: {role}</p>

      {role === "Owner" && (
        <div>
          <h2>Owner Dashboard</h2>
          <p>You have full access to all settings and users.</p>
        </div>
      )}

      {role === "Collaborator" && (
        <div>
          <h2>Collaborator Dashboard</h2>
          <p>You can edit business cases and view analytics.</p>
        </div>
      )}

      {role === "Viewer" && (
        <div>
          <h2>Viewer Dashboard</h2>
          <p>You can only view data and reports.</p>
        </div>
      )}

      {!role && <p>No role assigned to your user.</p>}
    </div>
  );
};

export default Dashboard;
