"use client";

import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { PageHeader } from "@/components/common/PageHeader";

export default function PatientAppointmentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Appointments"
        description="View and manage your scheduled appointments."
      />
      <LoadingSkeleton variant="card" count={4} />
    </div>
  );
}
