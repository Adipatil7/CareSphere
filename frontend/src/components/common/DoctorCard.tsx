"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { DoctorSearchResponse } from "@/types";
import { useUserNames, getDisplayName } from "@/hooks/useUserNames";
import { Stethoscope, Award } from "lucide-react";

interface DoctorCardProps {
  doctor: DoctorSearchResponse;
  onBook?: () => void;
}

export function DoctorCard({ doctor, onBook }: DoctorCardProps) {
  const namesMap = useUserNames([doctor.userId]);

  return (
    <Card className="border border-border shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Stethoscope className="h-6 w-6" />
          </div>
          <div className="space-y-1.5 min-w-0 flex-1">
            <p className="font-semibold text-foreground truncate">
              {getDisplayName(namesMap, doctor.userId, "Dr.")}
            </p>
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200 text-xs"
            >
              {doctor.specialization}
            </Badge>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Award className="h-3.5 w-3.5" />
              <span>{doctor.experienceYears} years experience</span>
            </div>
            {doctor.bio && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {doctor.bio}
              </p>
            )}
          </div>
        </div>
        {onBook && (
          <Button
            size="sm"
            onClick={onBook}
            className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Book Appointment
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
