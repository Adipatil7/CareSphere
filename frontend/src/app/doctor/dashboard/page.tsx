"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { AppointmentCard } from "@/components/common/AppointmentCard";
import { useAuth } from "@/hooks/useAuth";
import { appointmentService } from "@/services/appointment.service";
import type { AppointmentResponse } from "@/types";
import {
  Calendar,
  Users,
  Clock,
  AlertCircle,
  Activity,
  TrendingUp,
  FileText,
} from "lucide-react";

export default function DoctorDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const appts = await appointmentService.getByDoctor(user.id);
        setAppointments(appts);
      } catch {
        // Global error handler shows toast
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          description="Overview of your appointments and patient activity."
        />
        <LoadingSkeleton variant="page" />
      </div>
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const pendingRequests = appointments.filter(
    (a) => a.status === "REQUESTED"
  );
  const todaysAppointments = appointments.filter((a) => {
    const d = new Date(a.startTime);
    return (
      d >= today &&
      d < tomorrow &&
      (a.status === "ACCEPTED" || a.status === "REQUESTED")
    );
  });
  const uniquePatients = new Set(appointments.map((a) => a.patientId)).size;
  const completedCount = appointments.filter(
    (a) => a.status === "COMPLETED"
  ).length;

  const upcomingAppointments = appointments
    .filter((a) => a.status === "REQUESTED" || a.status === "ACCEPTED")
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    )
    .slice(0, 6);

  const stats = [
    {
      icon: Users,
      label: "Total Patients",
      value: uniquePatients,
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: Calendar,
      label: "Today's Appointments",
      value: todaysAppointments.length,
      color: "bg-violet-50 text-violet-600",
    },
    {
      icon: AlertCircle,
      label: "Pending Requests",
      value: pendingRequests.length,
      color: "bg-amber-50 text-amber-600",
    },
    {
      icon: Activity,
      label: "Completed",
      value: completedCount,
      color: "bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, Dr. ${user?.name?.split(" ")[0] ?? ""}!`}
        description="Overview of your appointments and patient activity."
      />

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border border-border shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}
                >
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
        <Card
          className="border border-border shadow-sm hover:shadow-md transition-all cursor-pointer group"
          onClick={() => router.push("/doctor/appointments")}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-transform group-hover:scale-110">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Manage Appointments
              </p>
              <p className="text-xs text-muted-foreground">
                Accept or manage requests
              </p>
            </div>
          </CardContent>
        </Card>
        <Card
          className="border border-border shadow-sm hover:shadow-md transition-all cursor-pointer group"
          onClick={() => router.push("/doctor/records")}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-transform group-hover:scale-110">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Medical Records
              </p>
              <p className="text-xs text-muted-foreground">
                Create visit notes
              </p>
            </div>
          </CardContent>
        </Card>
        <Card
          className="border border-border shadow-sm hover:shadow-md transition-all cursor-pointer group"
          onClick={() => router.push("/doctor/community")}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 transition-transform group-hover:scale-110">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Community</p>
              <p className="text-xs text-muted-foreground">
                Posts & patient Q&A
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground">
            Upcoming Appointments
          </h2>
          {upcomingAppointments.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary/80"
              onClick={() => router.push("/doctor/appointments")}
            >
              View all
            </Button>
          )}
        </div>

        {upcomingAppointments.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No upcoming appointments"
            description="You don't have any pending or accepted appointments right now."
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {upcomingAppointments.map((appt) => (
              <AppointmentCard
                key={appt.id}
                appointment={appt}
                otherPartyLabel="Patient"
                otherPartyId={appt.patientId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
