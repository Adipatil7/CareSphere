"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { consultationService } from "@/services/consultation.service";
import { appointmentService } from "@/services/appointment.service";
import type { ConsultSessionResponse, AppointmentResponse } from "@/types";
import { toast } from "sonner";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Monitor,
  Loader2,
  User,
  Clock,
  Calendar,
  Activity,
} from "lucide-react";

export default function PatientConsultPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [session, setSession] = useState<ConsultSessionResponse | null>(null);
  const [appointment, setAppointment] = useState<AppointmentResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [ending, setEnding] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  useEffect(() => {
    // Mark as loaded — session data comes from parent flow
    setLoading(false);
  }, []);

  const handleEndConsultation = async () => {
    if (!roomId) return;
    setEnding(true);
    try {
      await consultationService.end(roomId);
      toast.success("Consultation ended successfully.");
      router.push("/patient/appointments");
    } catch {
      // Global error handler shows toast
    } finally {
      setEnding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Joining consultation...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Consultation Room
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge
              variant="outline"
              className="bg-emerald-50 text-emerald-700 border-emerald-200"
            >
              <Activity className="h-3 w-3 mr-1" />
              Live
            </Badge>
            <span className="text-sm text-muted-foreground">
              Room: {roomId}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Video Area */}
        <div className="space-y-4">
          {/* Main Video Feed */}
          <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden border border-slate-800">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-800 mx-auto mb-3">
                  <User className="h-10 w-10 text-slate-400" />
                </div>
                <p className="text-slate-400 text-sm">Doctor&apos;s Video Feed</p>
                <p className="text-slate-500 text-xs mt-1">
                  Video consultation in progress
                </p>
              </div>
            </div>

            {/* Self Preview */}
            <div className="absolute bottom-4 right-4 w-40 h-28 bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
              <div className="flex items-center justify-center h-full">
                {isVideoOff ? (
                  <VideoOff className="h-6 w-6 text-slate-500" />
                ) : (
                  <div className="text-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 mx-auto mb-1">
                      <span className="text-white text-sm font-semibold">
                        {user?.name?.charAt(0).toUpperCase() ?? "Y"}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[10px]">You</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            <Button
              id="toggle-mic-btn"
              variant="outline"
              size="lg"
              className={`rounded-full h-12 w-12 p-0 ${
                isMuted
                  ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                  : "hover:bg-slate-100"
              }`}
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? (
                <MicOff className="h-5 w-5" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
            </Button>
            <Button
              id="toggle-video-btn"
              variant="outline"
              size="lg"
              className={`rounded-full h-12 w-12 p-0 ${
                isVideoOff
                  ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                  : "hover:bg-slate-100"
              }`}
              onClick={() => setIsVideoOff(!isVideoOff)}
            >
              {isVideoOff ? (
                <VideoOff className="h-5 w-5" />
              ) : (
                <Video className="h-5 w-5" />
              )}
            </Button>
            <Button
              id="end-call-btn"
              size="lg"
              className="rounded-full h-12 w-12 p-0 bg-red-600 hover:bg-red-700 text-white"
              onClick={handleEndConsultation}
              disabled={ending}
            >
              {ending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <PhoneOff className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Info Panel */}
        <div className="space-y-4">
          <Card className="border border-border shadow-sm">
            <CardContent className="p-5 space-y-4">
              <h3 className="font-semibold text-foreground">
                Session Details
              </h3>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Monitor className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-muted-foreground">Room ID</p>
                    <p className="font-medium text-foreground text-xs truncate">
                      {roomId}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <User className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-muted-foreground">Patient</p>
                    <p className="font-medium text-foreground">
                      {user?.name ?? "You"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-muted-foreground">Started At</p>
                    <p className="font-medium text-foreground">
                      {new Date().toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border shadow-sm">
            <CardContent className="p-5">
              <h3 className="font-semibold text-foreground mb-3">
                Consultation Tips
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  Ensure good lighting and stable internet
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  Have your medical history ready
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  Note down your symptoms beforehand
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  Ask about follow-up instructions
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
