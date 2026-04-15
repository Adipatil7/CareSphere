"use client";

import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { PageHeader } from "@/components/common/PageHeader";

export default function DoctorAppointmentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Appointments"
        description="Manage your patient appointment requests."
      />
      <LoadingSkeleton variant="table-row" count={5} />
    </div>
  );
}
