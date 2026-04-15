"use client";

import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { PageHeader } from "@/components/common/PageHeader";

export default function PharmacyPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Pharmacy"
        description="Search for medicines and check availability at nearby pharmacies."
      />
      <LoadingSkeleton variant="list" count={5} />
    </div>
  );
}
