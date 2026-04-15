"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Video, PhoneOff } from "lucide-react";

export default function PatientConsultPage({
  params,
}: {
  params: { roomId: string };
}) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Video Consultation"
        description={`Room: ${params.roomId}`}
      />
      {/* Video placeholder */}
      <Card className="border border-border shadow-sm overflow-hidden">
        <div className="aspect-video bg-slate-900 flex items-center justify-center">
          <p className="text-slate-400 text-sm">Video consultation area — WebRTC coming soon</p>
        </div>
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-3">
            <Button size="sm" variant="outline" className="rounded-full h-10 w-10 p-0">
              <Mic className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" className="rounded-full h-10 w-10 p-0">
              <Video className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="destructive" className="rounded-full h-10 w-10 p-0">
              <PhoneOff className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
