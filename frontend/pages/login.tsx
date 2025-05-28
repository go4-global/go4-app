// File: frontend/pages/login.tsx

import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Step 1: Try logging in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error?.message === "Invalid login credentials") {
      // Step 2: Try signing up if login failed
      const { error: signupError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signupError) {
        setError("Signup failed: " + signupError.message);
        setLoading(false);
        return;
      }

      // Signup success
      router.push("/dashboard");
    } else if (error) {
      setError("Login failed: " + error.message);
    } else {
      // Login success
      router.push("/dashboard");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-4">Log in to Go4</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Processing..." : "Log In / Sign Up"}
        </button>
      </form>
    </div>
  );
}
