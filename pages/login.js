import { useState } from "react";
import { useRouter } from "next/router";
import { login } from "../lib/apiClient";
import { ShieldCheck, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@eatout.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      const from = router.query.from || "/dashboard/overview";
      router.push(from);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-black font-bold">
            EO
          </div>
          <div>
            <div className="text-sm font-semibold">EatOut Admin</div>
            <div className="text-xs text-neutral-400">Restaurant Owner Dashboard</div>
          </div>
        </div>

        <h1 className="text-lg font-semibold tracking-tight mb-1">Admin Login</h1>
        <p className="text-xs text-neutral-400 mb-5">
          Sign in with your admin credentials to manage orders and menu.
        </p>

        {error && (
          <div className="mb-4 text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-neutral-300">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/60"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-neutral-300">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/60"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary text-black text-sm font-medium hover:bg-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                Sign in as Admin
              </>
            )}
          </button>
        </form>

        <p className="mt-4 text-[11px] text-neutral-500">
          Demo credentials: <span className="text-neutral-300">admin@eatout.com</span> /{" "}
          <span className="text-neutral-300">password123</span>
        </p>
      </div>
    </div>
  );
}

