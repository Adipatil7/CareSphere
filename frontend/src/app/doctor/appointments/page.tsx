"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { AppointmentCard } from "@/components/common/AppointmentCard";
import { useAuth } from "@/hooks/useAuth";
import { appointmentService } from "@/services/appointment.service";
import { consultationService } from "@/services/consultation.service";
import type { AppointmentResponse, AppointmentStatus } from "@/types";
import { toast } from "sonner";
import { Calendar, AlertTriangle, Loader2 } from "lucide-react";

export default function DoctorAppointmentsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchAppointments = async () => {
      try {
        const data = await appointmentService.getByDoctor(user.id);
        setAppointments(data);
      } catch {
        // Global error handler shows toast
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user]);

  const updateAppointmentStatus = (
    id: string,
    newStatus: AppointmentStatus
  ) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  const handleAccept = async (id: string) => {
    setActionLoadingId(id);
    try {
      await appointmentService.accept(id);
      updateAppointmentStatus(id, "ACCEPTED");
      toast.success("Appointment accepted!");
    } catch {
      // Global error handler shows toast
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCancel = async (id: string) => {
    setActionLoadingId(id);
    try {
      await appointmentService.cancel(id);
      updateAppointmentStatus(id, "CANCELLED");
      toast.success("Appointment cancelled.");
    } catch {
      // Global error handler shows toast
    } finally {
      setActionLoadingId(null);
      setConfirmCancelId(null);
    }
  };

  const handleStartConsultation = async (appt: AppointmentResponse) => {
    if (!user) return;
    setActionLoadingId(appt.id);
    try {
      const session = await consultationService.start({
        appointmentId: appt.id,
        doctorId: user.id,
        patientId: appt.patientId,
      });
      toast.success("Consultation started!");
      router.push(`/doctor/consult/${session.roomId}`);
    } catch {
      // Global error handler shows toast
    } finally {
      setActionLoadingId(null);
    }
  };

  const getActionsForAppointment = (appt: AppointmentResponse) => {
    const actions: {
      label: string;
      onClick: () => void;
      variant?: "default" | "destructive" | "outline";
      loading?: boolean;
    }[] = [];

    const isLoading = actionLoadingId === appt.id;

    if (appt.status === "REQUESTED") {
      actions.push({
        label: "Accept",
        onClick: () => handleAccept(appt.id),
        variant: "default",
        loading: isLoading,
      });
      actions.push({
        label: "Decline",
        onClick: () => setConfirmCancelId(appt.id),
        variant: "destructive",
        loading: false,
      });
    }

    if (appt.status === "ACCEPTED") {
      actions.push({
        label: "Start Consultation",
        onClick: () => handleStartConsultation(appt),
        variant: "default",
        loading: isLoading,
      });
      actions.push({
        label: "Cancel",
        onClick: () => setConfirmCancelId(appt.id),
        variant: "outline",
        loading: false,
      });
    }

    return actions;
  };

  const filterByStatus = (
    items: AppointmentResponse[],
    statuses: AppointmentStatus[]
  ) => items.filter((a) => statuses.includes(a.status));

  const requested = filterByStatus(appointments, ["REQUESTED"]).sort(
    (a, b) =>
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );
  const accepted = filterByStatus(appointments, ["ACCEPTED"]).sort(
    (a, b) =>
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );
  const completed = filterByStatus(appointments, ["COMPLETED"]).sort(
    (a, b) =>
      new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  );
  const cancelled = filterByStatus(appointments, ["CANCELLED"]).sort(
    (a, b) =>
      new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Appointments"
          description="Manage your patient appointments."
        />
        <LoadingSkeleton variant="card" count={4} />
      </div>
    );
  }

  const renderList = (
    items: AppointmentResponse[],
    emptyTitle: string,
    emptyDesc: string
  ) => {
    if (items.length === 0) {
      return (
        <EmptyState
          icon={Calendar}
          title={emptyTitle}
          description={emptyDesc}
        />
      );
    }
    return (
      <div className="grid gap-3 md:grid-cols-2">
        {items.map((appt) => (
          <AppointmentCard
            key={appt.id}
            appointment={appt}
            otherPartyLabel="Patient"
            otherPartyId={appt.patientId}
            actions={getActionsForAppointment(appt)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Appointments"
        description="Manage your patient appointments."
      />

      <Tabs defaultValue="requested" className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-lg">
          <TabsTrigger value="requested" className="text-xs sm:text-sm">
            Requests ({requested.length})
          </TabsTrigger>
          <TabsTrigger value="accepted" className="text-xs sm:text-sm">
            Accepted ({accepted.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-xs sm:text-sm">
            Done ({completed.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="text-xs sm:text-sm">
            Cancelled ({cancelled.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requested" className="mt-4">
          {renderList(
            requested,
            "No pending requests",
            "You don't have any new appointment requests."
          )}
        </TabsContent>

        <TabsContent value="accepted" className="mt-4">
          {renderList(
            accepted,
            "No accepted appointments",
            "Accept a request to see it here."
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-4">
          {renderList(
            completed,
            "No completed appointments",
            "Your completed appointments will appear here."
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="mt-4">
          {renderList(
            cancelled,
            "No cancelled appointments",
            "No appointments have been cancelled."
          )}
        </TabsContent>
      </Tabs>

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={!!confirmCancelId}
        onOpenChange={(open) => !open && setConfirmCancelId(null)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Cancel Appointment
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this appointment? The patient will
              be notified.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end pt-2">
            <Button
              variant="outline"
              onClick={() => setConfirmCancelId(null)}
              disabled={actionLoadingId !== null}
            >
              Keep It
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                confirmCancelId && handleCancel(confirmCancelId)
              }
              disabled={actionLoadingId !== null}
            >
              {actionLoadingId && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Yes, Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
