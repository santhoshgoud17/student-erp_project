import { useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { GraduationCap, Loader2 } from "lucide-react";
import { useAuth } from "../lib/auth";
import { errorMessage } from "../lib/api";

const DEMO = [
  { label: "Student", email: "student@erp.local", pw: "Student@123" },
  { label: "Faculty", email: "faculty@erp.local", pw: "Faculty@123" },
  { label: "Admin", email: "admin@erp.local", pw: "Admin@123" },
];

export default function Login() {
  const { user, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(""); setBusy(true);
    try { await login(email.trim(), password); }
    catch (err) { setError(errorMessage(err)); }
    finally { setBusy(false); }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-navy-900 p-12 text-white lg:flex">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl" />
        <div className="absolute -bottom-24 -left-12 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="relative flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500"><GraduationCap /></div>
          <span className="text-lg font-bold">University ERP</span>
        </div>
        <div className="relative">
          <h1 className="text-4xl font-bold leading-tight">One place for everything<br />academic.</h1>
          <p className="mt-4 max-w-md text-slate-300">Attendance, results, timetable, assignments and fees, all in a single secure portal.</p>
        </div>
        <p className="relative text-xs text-slate-400">© 2026 University ERP</p>
      </div>

      <div className="flex items-center justify-center p-6">
        <form onSubmit={submit} className="w-full max-w-sm">
          <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
          <p className="mt-1 text-sm text-slate-500">Sign in with your college credentials.</p>

          <label className="mt-6 block text-sm font-medium text-slate-700">Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30" />

          <label className="mt-4 block text-sm font-medium text-slate-700">Password</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30" />

          {error && <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

          <button disabled={busy} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60">
            {busy && <Loader2 size={16} className="animate-spin" />} Sign in
          </button>

          <div className="mt-8 rounded-xl bg-slate-100 p-3">
            <p className="mb-2 text-xs font-medium text-slate-500">Demo accounts (development only)</p>
            <div className="flex gap-2">
              {DEMO.map((d) => (
                <button type="button" key={d.label} onClick={() => { setEmail(d.email); setPassword(d.pw); }}
                  className="flex-1 rounded-lg bg-white py-1.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200 hover:ring-brand-500">
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
