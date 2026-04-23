"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { AppointmentCard } from "@/components/common/AppointmentCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useAuth } from "@/hooks/useAuth";
import { appointmentService } from "@/services/appointment.service";
import { contentService } from "@/services/content.service";
import type { AppointmentResponse, Post } from "@/types";
import {
  Calendar,
  Search,
  FileText,
  Pill,
  Users,
  Activity,
  Clock,
  TrendingUp,
} from "lucide-react";

export default function PatientDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [appts, posts] = await Promise.all([
          appointmentService.getByPatient(user.id),
          contentService.getPosts(),
        ]);
        setAppointments(appts);
        setRecentPosts(posts.slice(0, 3));
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
          description="Welcome back! Here's an overview of your healthcare activity."
        />
        <LoadingSkeleton variant="page" />
      </div>
    );
  }

  const upcomingAppointments = appointments
    .filter(
      (a) => a.status === "REQUESTED" || a.status === "ACCEPTED"
    )
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    )
    .slice(0, 5);

  const completedCount = appointments.filter(
    (a) => a.status === "COMPLETED"
  ).length;
  const upcomingCount = upcomingAppointments.length;
  const totalAppointments = appointments.length;

  const quickActions = [
    {
      icon: Search,
      label: "Find Doctors",
      description: "Search specialists",
      path: "/patient/doctors",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: Calendar,
      label: "Appointments",
      description: "View schedule",
      path: "/patient/appointments",
      color: "bg-violet-50 text-violet-600",
    },
    {
      icon: FileText,
      label: "Records",
      description: "Medical history",
      path: "/patient/records",
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      icon: Pill,
      label: "Pharmacy",
      description: "Find medicines",
      path: "/patient/pharmacy",
      color: "bg-amber-50 text-amber-600",
    },
    {
      icon: Users,
      label: "Community",
      description: "Health discussions",
      path: "/patient/community",
      color: "bg-rose-50 text-rose-600",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.name?.split(" ")[0] ?? "there"}!`}
        description="Here's an overview of your healthcare activity."
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border border-border shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Upcoming</p>
                <p className="text-2xl font-bold text-foreground">
                  {upcomingCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                <Activity className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-foreground">
                  {completedCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50">
                <TrendingUp className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Visits</p>
                <p className="text-2xl font-bold text-foreground">
                  {totalAppointments}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">
          Quick Actions
        </h2>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          {quickActions.map((action) => (
            <Card
              key={action.label}
              className="border border-border shadow-sm hover:shadow-md transition-all cursor-pointer group"
              onClick={() => router.push(action.path)}
            >
              <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${action.color} transition-transform group-hover:scale-110`}
                >
                  <action.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {action.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
              onClick={() => router.push("/patient/appointments")}
            >
              View all
            </Button>
          )}
        </div>

        {upcomingAppointments.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No upcoming appointments"
            description="You don't have any scheduled appointments. Find a doctor to book your first visit."
            actionLabel="Find a Doctor"
            onAction={() => router.push("/patient/doctors")}
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {upcomingAppointments.map((appt) => (
              <AppointmentCard
                key={appt.id}
                appointment={appt}
                otherPartyLabel="Doctor"
                otherPartyId={appt.doctorId}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recent Community Posts */}
      {recentPosts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-foreground">
              Recent Health Posts
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary/80"
              onClick={() => router.push("/patient/community")}
            >
              View all
            </Button>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {recentPosts.map((post) => (
              <Card
                key={post.id}
                className="border border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push("/patient/community")}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                      {post.category}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      <Clock className="inline h-3 w-3 mr-1" />
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <h3 className="font-medium text-sm text-foreground line-clamp-1">
                    {post.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {post.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
