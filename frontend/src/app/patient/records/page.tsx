"use client";

import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { PageHeader } from "@/components/common/PageHeader";

export default function PatientRecordsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Medical Records"
        description="View your consultation history and prescriptions."
      />
      <LoadingSkeleton variant="card" count={4} />
    </div>
  );
}
