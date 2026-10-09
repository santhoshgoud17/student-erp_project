import { useLocation } from "react-router-dom";
import { Construction } from "lucide-react";

export default function ComingSoon() {
  const name = useLocation().pathname.replace("/", "") || "page";
  return (
    <div className="grid place-items-center rounded-2xl bg-white p-16 text-center shadow-sm ring-1 ring-slate-200/70">
      <Construction className="text-amber-500" size={40} />
      <h2 className="mt-4 text-xl font-bold capitalize">{name}</h2>
      <p className="mt-1 text-sm text-slate-500">This module is planned for a later phase.</p>
    </div>
  );
}
