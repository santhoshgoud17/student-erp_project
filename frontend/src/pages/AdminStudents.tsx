import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { api, errorMessage } from "../lib/api";
import { Card, ErrorBox, Skeleton } from "../components/ui";

interface Row { id: number; roll_number: string; name: string; department: string; semester: number }
interface Page { total: number; page: number; page_size: number; items: Row[] }

export default function AdminStudents() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Page | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setData(null);
    api.get<Page>("/api/admin/students", { params: { page, page_size: 10 } })
      .then((r) => setData(r.data))
      .catch((e) => setError(errorMessage(e)));
  }, [page]);

  if (error) return <ErrorBox message={error} />;
  const pages = data ? Math.max(1, Math.ceil(data.total / data.page_size)) : 1;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Students</h1>
      <Card>
        {!data ? <Skeleton className="h-48" /> : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase text-slate-500">
                  <tr><th className="py-2">Roll no.</th><th>Name</th><th>Department</th><th>Semester</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.items.map((s) => (
                    <tr key={s.id}>
                      <td className="py-3 font-medium">{s.roll_number}</td><td>{s.name}</td>
                      <td>{s.department}</td><td>{s.semester}</td>
                    </tr>
                  ))}
                  {data.items.length === 0 && <tr><td colSpan={4} className="py-8 text-center text-slate-400">No students yet.</td></tr>}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
              <span>{data.total} students</span>
              <div className="flex items-center gap-2">
                <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded-lg p-1.5 ring-1 ring-slate-200 disabled:opacity-40"><ChevronLeft size={16} /></button>
                <span>Page {page} of {pages}</span>
                <button disabled={page >= pages} onClick={() => setPage(page + 1)} className="rounded-lg p-1.5 ring-1 ring-slate-200 disabled:opacity-40"><ChevronRight size={16} /></button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
