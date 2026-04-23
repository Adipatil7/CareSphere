"use client";

import { useState, useEffect } from "react";
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
import type { AppointmentResponse, AppointmentStatus } from "@/types";
import { toast } from "sonner";
import { Calendar, Search, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PatientAppointmentsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchAppointments = async () => {
      try {
        const data = await appointmentService.getByPatient(user.id);
        setAppointments(data);
      } catch {
        // Global error handler shows toast
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user]);

  const handleCancel = async (id: string) => {
    setCancellingId(id);
    try {
      await appointmentService.cancel(id);
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, status: "CANCELLED" as AppointmentStatus } : a
        )
      );
      toast.success("Appointment cancelled successfully.");
    } catch {
      // Global error handler shows toast
    } finally {
      setCancellingId(null);
      setConfirmCancelId(null);
    }
  };

  const getActionsForAppointment = (appt: AppointmentResponse) => {
    const actions: {
      label: string;
      onClick: () => void;
      variant?: "default" | "destructive" | "outline";
      loading?: boolean;
    }[] = [];

    if (appt.status === "REQUESTED" || appt.status === "ACCEPTED") {
      actions.push({
        label: "Cancel",
        onClick: () => setConfirmCancelId(appt.id),
        variant: "destructive",
        loading: cancellingId === appt.id,
      });
    }

    return actions;
  };

  const filterByStatus = (
    items: AppointmentResponse[],
    statuses: AppointmentStatus[]
  ) => items.filter((a) => statuses.includes(a.status));

  const upcoming = filterByStatus(appointments, ["REQUESTED", "ACCEPTED"]).sort(
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
          description="Manage your scheduled appointments."
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
        <EmptyState icon={Calendar} title={emptyTitle} description={emptyDesc} />
      );
    }
    return (
      <div className="grid gap-3 md:grid-cols-2">
        {items.map((appt) => (
          <AppointmentCard
            key={appt.id}
            appointment={appt}
            otherPartyLabel="Doctor"
            otherPartyId={appt.doctorId}
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
        description="Manage your scheduled appointments."
        actionLabel="Find a Doctor"
        actionIcon={Search}
        onAction={() => router.push("/patient/doctors")}
      />

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="upcoming" className="text-sm">
            Upcoming ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-sm">
            Completed ({completed.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="text-sm">
            Cancelled ({cancelled.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-4">
          {renderList(
            upcoming,
            "No upcoming appointments",
            "You don't have any scheduled appointments. Find a doctor to book one."
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
              Are you sure you want to cancel this appointment? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end pt-2">
            <Button
              variant="outline"
              onClick={() => setConfirmCancelId(null)}
              disabled={cancellingId !== null}
            >
              Keep It
            </Button>
            <Button
              variant="destructive"
              onClick={() => confirmCancelId && handleCancel(confirmCancelId)}
              disabled={cancellingId !== null}
            >
              {cancellingId && (
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent inline-block" />
              )}
              Yes, Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
