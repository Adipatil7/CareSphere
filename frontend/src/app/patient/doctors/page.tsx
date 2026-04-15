"use client";

import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { PageHeader } from "@/components/common/PageHeader";

export default function DoctorsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Find Doctors"
        description="Search for doctors by specialization and book appointments."
      />
      <LoadingSkeleton variant="card" count={6} />
    </div>
  );
}
