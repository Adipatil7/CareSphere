"use client";

import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { PageHeader } from "@/components/common/PageHeader";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-12 md:px-6">
        <PageHeader
          title="Profile"
          description="View and manage your account information."
        />
        <div className="mt-6">
          <LoadingSkeleton variant="card" count={2} />
        </div>
      </div>
    </div>
  );
}
