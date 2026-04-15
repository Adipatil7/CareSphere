"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import type { AppointmentResponse } from "@/types";
import { Calendar, Clock, Loader2 } from "lucide-react";

interface AppointmentCardProps {
  appointment: AppointmentResponse;
  /** Label for the other party (e.g. "Doctor" for patient view, "Patient" for doctor view) */
  otherPartyLabel?: string;
  /** ID of the other party to display */
  otherPartyId?: string;
  actions?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "destructive" | "outline";
    loading?: boolean;
  }[];
}

export function AppointmentCard({
  appointment,
  otherPartyLabel = "Doctor",
  otherPartyId,
  actions,
}: AppointmentCardProps) {
  const startDate = new Date(appointment.startTime);
  const endDate = new Date(appointment.endTime);

  const dateStr = startDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const timeStr = `${startDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })} — ${endDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;

  return (
    <Card className="border border-border shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={appointment.status} />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              <span>{dateStr}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              <span>{timeStr}</span>
            </div>
            {otherPartyId && (
              <p className="text-sm text-foreground">
                <span className="text-muted-foreground">{otherPartyLabel}:</span>{" "}
                <span className="font-medium">{otherPartyId.slice(0, 8)}...</span>
              </p>
            )}
          </div>
        </div>
        {actions && actions.length > 0 && (
          <div className="flex gap-2 mt-4 pt-3 border-t border-border">
            {actions.map((action) => (
              <Button
                key={action.label}
                size="sm"
                variant={action.variant === "destructive" ? "destructive" : action.variant === "outline" ? "outline" : "default"}
                onClick={action.onClick}
                disabled={action.loading}
                className={
                  action.variant === "default" || !action.variant
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                    : ""
                }
              >
                {action.loading && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
