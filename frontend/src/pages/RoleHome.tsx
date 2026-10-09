import { useEffect, useState } from "react";
import { BookOpen, CalendarCheck, ClipboardList, Users } from "lucide-react";
import { useAuth } from "../lib/auth";
import { api } from "../lib/api";
import { Card, StatCard } from "../components/ui";
import StudentDashboard from "./StudentDashboard";

function AdminHome() {
  const [total, setTotal] = useState<number | string>("…");
  useEffect(() => {
    api.get("/api/admin/students", { params: { page_size: 1 } })
      .then((r) => setTotal(r.data.total)).catch(() => setTotal("—"));
  }, []);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Administrator dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total students" value={total} icon={Users} tint="indigo" hint="Live from database" />
        <StatCard label="Faculty" value="—" icon={Users} tint="emerald" hint="Coming soon" />
        <StatCard label="Active courses" value="—" icon={BookOpen} tint="sky" hint="Coming soon" />
        <StatCard label="Attendance overview" value="—" icon={CalendarCheck} tint="amber" hint="Coming soon" />
      </div>
      <Card title="Next steps"><p className="text-sm text-slate-600">Student management is live. Departments, courses, faculty and reports arrive in the next phases.</p></Card>
    </div>
  );
}

function FacultyHome() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Faculty dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Assigned courses" value="—" icon={BookOpen} tint="indigo" hint="Coming soon" />
        <StatCard label="Pending reviews" value="—" icon={ClipboardList} tint="amber" hint="Coming soon" />
      </div>
      <Card title="Coming soon"><p className="text-sm text-slate-600">Attendance entry, assignments and marks entry will appear here once those modules are built.</p></Card>
    </div>
  );
}

export default function RoleHome() {
  const { user } = useAuth();
  if (user?.role === "admin") return <AdminHome />;
  if (user?.role === "faculty") return <FacultyHome />;
  return <StudentDashboard />;
}
