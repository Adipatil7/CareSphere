import { Badge } from "@/components/ui/badge";
import type { AppointmentStatus } from "@/types";

const statusConfig: Record<
  AppointmentStatus,
  { label: string; className: string }
> = {
  REQUESTED: {
    label: "Requested",
    className: "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100",
  },
  ACCEPTED: {
    label: "Accepted",
    className: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-100",
  },
};

interface StatusBadgeProps {
  status: AppointmentStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] ?? {
    label: status,
    className: "bg-slate-100 text-slate-600",
  };

  return (
    <Badge variant="outline" className={`text-xs font-medium ${config.className}`}>
      {config.label}
    </Badge>
  );
}
