"use client";

import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { PageHeader } from "@/components/common/PageHeader";

export default function DoctorRecordsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Medical Records"
        description="Create visit records and prescriptions for your patients."
      />
      <LoadingSkeleton variant="card" count={3} />
    </div>
  );
}
