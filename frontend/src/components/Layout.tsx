import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  Bell, BookOpen, CalendarClock, CalendarCheck, ClipboardList, GraduationCap, LayoutDashboard,
  LogOut, Menu, Search, Users, Wallet, X, type LucideIcon,
} from "lucide-react";
import { useAuth, type Role } from "../lib/auth";

interface NavItem { to: string; label: string; icon: LucideIcon }

const NAV: Record<Role, NavItem[]> = {
  student: [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/attendance", label: "Attendance", icon: CalendarCheck },
    { to: "/academics", label: "Academics", icon: BookOpen },
    { to: "/timetable", label: "Timetable", icon: CalendarClock },
    { to: "/examinations", label: "Examinations", icon: GraduationCap },
    { to: "/assignments", label: "Assignments", icon: ClipboardList },
    { to: "/fees", label: "Fees", icon: Wallet },
    { to: "/notifications", label: "Notifications", icon: Bell },
  ],
  faculty: [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/attendance", label: "Attendance", icon: CalendarCheck },
    { to: "/assignments", label: "Assignments", icon: ClipboardList },
    { to: "/examinations", label: "Marks entry", icon: GraduationCap },
    { to: "/timetable", label: "Timetable", icon: CalendarClock },
    { to: "/notifications", label: "Announcements", icon: Bell },
  ],
  admin: [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/students", label: "Students", icon: Users },
    { to: "/academics", label: "Academics", icon: BookOpen },
    { to: "/timetable", label: "Timetable", icon: CalendarClock },
    { to: "/examinations", label: "Results", icon: GraduationCap },
    { to: "/fees", label: "Fees", icon: Wallet },
    { to: "/notifications", label: "Announcements", icon: Bell },
  ],
};

export default function Layout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  if (!user) return null;
  const items = NAV[user.role];
  const initial = user.email[0].toUpperCase();

  const sidebar = (
    <div className="flex h-full flex-col bg-navy-900 text-slate-300">
      <div className="flex items-center gap-3 px-6 py-5">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500 text-white"><GraduationCap size={20} /></div>
        <div>
          <p className="text-sm font-bold leading-tight text-white">University ERP</p>
          <p className="text-[11px] capitalize text-slate-400">{user.role} portal</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-2">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to} to={to} end={to === "/"} onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive ? "bg-brand-500 text-white shadow" : "hover:bg-navy-800 hover:text-white"
              }`}
          >
            <Icon size={18} /> {label}
          </NavLink>
        ))}
      </nav>
      <button onClick={logout} className="m-3 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-navy-800 hover:text-white">
        <LogOut size={18} /> Sign out
      </button>
    </div>
  );

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">{sidebar}</aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64">{sidebar}</aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur sm:px-8">
          <button className="rounded-lg p-2 hover:bg-slate-100 lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="relative hidden max-w-md flex-1 sm:block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input placeholder="Search..." className="w-full rounded-xl bg-slate-100 py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-brand-500/40" />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button className="relative rounded-xl p-2 hover:bg-slate-100" aria-label="Notifications">
              <Bell size={20} className="text-slate-600" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500" />
            </button>
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-500 text-sm font-bold text-white">{initial}</div>
              <div className="hidden text-left leading-tight sm:block">
                <p className="max-w-[160px] truncate text-sm font-semibold">{user.email}</p>
                <p className="text-xs capitalize text-slate-500">{user.role}</p>
              </div>
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-8"><Outlet /></main>
      </div>
    </div>
  );
}
