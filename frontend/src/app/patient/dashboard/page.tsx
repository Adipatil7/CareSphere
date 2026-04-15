"use client";

import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { PageHeader } from "@/components/common/PageHeader";

export default function PatientDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's an overview of your healthcare activity."
      />
      <LoadingSkeleton variant="page" />
    </div>
  );
}
