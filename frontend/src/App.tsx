import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth, type Role } from "./lib/auth";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import RoleHome from "./pages/RoleHome";
import AdminStudents from "./pages/AdminStudents";
import ComingSoon from "./pages/ComingSoon";
import { Skeleton } from "./components/ui";
import type { ReactNode } from "react";

function Protected({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8"><Skeleton className="h-40" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function RoleOnly({ roles, children }: { roles: Role[]; children: ReactNode }) {
  const { user } = useAuth();
  if (!user || !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Protected><Layout /></Protected>}>
        <Route path="/" element={<RoleHome />} />
        <Route path="/students" element={<RoleOnly roles={["admin"]}><AdminStudents /></RoleOnly>} />
        <Route path="*" element={<ComingSoon />} />
      </Route>
    </Routes>
  );
}
