"use client";

import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { PageHeader } from "@/components/common/PageHeader";

export default function PatientCommunityPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Community"
        description="Health awareness posts and Q&A from the CareSphere community."
      />
      <LoadingSkeleton variant="card" count={4} />
    </div>
  );
}
