"use client";

import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { PageHeader } from "@/components/common/PageHeader";

export default function DoctorCommunityPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Community"
        description="Create awareness posts and answer patient questions."
      />
      <LoadingSkeleton variant="card" count={4} />
    </div>
  );
}
