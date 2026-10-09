import { useEffect, useState } from "react";
import {
  Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { BookOpen, CalendarCheck, ClipboardList, FileText, GraduationCap, Wallet } from "lucide-react";
import { api, errorMessage } from "../lib/api";
import { Card, ErrorBox, Skeleton, StatCard } from "../components/ui";

interface Dashboard {
  profile: { name: string; roll_number: string; department: string; semester: number };
  stats: {
    attendance_percent: number; cgpa: number; courses: number;
    pending_assignments: number; fee_status: string; upcoming_exams: number;
  };
  today_schedule: { time: string; subject: string; room: string }[];
}

// SAMPLE data for charts and notifications until the attendance/results/notification modules exist.
const attendanceBySubject = [
  { subject: "Python", value: 92 }, { subject: "DBMS", value: 85 }, { subject: "DSA", value: 88 },
  { subject: "OS", value: 79 }, { subject: "Networks", value: 90 }, { subject: "Maths", value: 83 },
];
const sgpaTrend = [
  { sem: "Sem 1", sgpa: 8.1 }, { sem: "Sem 2", sgpa: 8.4 }, { sem: "Sem 3", sgpa: 8.7 },
  { sem: "Sem 4", sgpa: 8.9 },
];
const notifications = [
  "Assignment deadline approaching: DBMS Lab Record",
  "Internal examination timetable published",
  "Attendance updated for this week",
  "New announcement from Faculty A",
];

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

export default function StudentDashboard() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get<Dashboard>("/api/students/me/dashboard")
      .then((r) => setData(r.data))
      .catch((e) => setError(errorMessage(e)));
  }, []);

  if (error) return <ErrorBox message={error} />;
  if (!data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
        <div className="grid gap-6 lg:grid-cols-2"><Skeleton className="h-72" /><Skeleton className="h-72" /></div>
      </div>
    );
  }

  const { profile: p, stats: s } = data;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-navy-800 to-brand-500 p-6 text-white shadow-sm">
        <p className="text-sm text-indigo-100">{greeting()},</p>
        <h1 className="text-2xl font-bold">{p.name}</h1>
        <p className="mt-1 text-sm text-indigo-100">
          {p.roll_number} · {p.department} · Semester {p.semester}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Attendance" value={`${s.attendance_percent}%`} icon={CalendarCheck} tint="emerald" hint="Overall" />
        <StatCard label="CGPA" value={s.cgpa.toFixed(2)} icon={GraduationCap} tint="indigo" />
        <StatCard label="Courses" value={s.courses} icon={BookOpen} tint="sky" hint="This semester" />
        <StatCard label="Pending assignments" value={s.pending_assignments} icon={ClipboardList} tint="amber" />
        <StatCard label="Fee status" value={s.fee_status} icon={Wallet} tint="violet" />
        <StatCard label="Upcoming exams" value={s.upcoming_exams} icon={FileText} tint="rose" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Subject-wise attendance (%)">
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={attendanceBySubject}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="subject" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: "#f1f5f9" }} />
                <Bar dataKey="value" name="Attendance %" fill="#4f46e5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Semester-wise SGPA">
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={sgpaTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="sem" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis domain={[6, 10]} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="sgpa" name="SGPA" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Today's schedule">
          <ul className="divide-y divide-slate-100">
            {data.today_schedule.map((c) => (
              <li key={c.time} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{c.subject}</p>
                  <p className="text-xs text-slate-500">{c.time}</p>
                </div>
                <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">{c.room}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Recent notifications">
          <ul className="space-y-3">
            {notifications.map((n) => (
              <li key={n} className="flex gap-3 text-sm text-slate-700">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" /> {n}
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <p className="text-xs text-slate-400">Profile and top cards come from the API; charts and notifications show sample data until their modules are built.</p>
    </div>
  );
}
