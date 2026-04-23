"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { DoctorCard } from "@/components/common/DoctorCard";
import { useAuth } from "@/hooks/useAuth";
import { useUserNames, getDisplayName } from "@/hooks/useUserNames";
import { profileService } from "@/services/profile.service";
import { appointmentService } from "@/services/appointment.service";
import type {
  DoctorSearchResponse,
  DoctorAvailabilityResponse,
} from "@/types";
import { toast } from "sonner";
import {
  Search,
  Loader2,
  Stethoscope,
  Clock,
  CalendarDays,
} from "lucide-react";

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function FindDoctorsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [doctors, setDoctors] = useState<DoctorSearchResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const doctorUserIds = useMemo(() => doctors.map((d) => d.userId), [doctors]);
  const namesMap = useUserNames(doctorUserIds);

  // Booking dialog state
  const [selectedDoctor, setSelectedDoctor] =
    useState<DoctorSearchResponse | null>(null);
  const [availability, setAvailability] = useState<
    DoctorAvailabilityResponse[]
  >([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingStartTime, setBookingStartTime] = useState("");
  const [bookingEndTime, setBookingEndTime] = useState("");
  const [isBooking, setIsBooking] = useState(false);

  // Debounced search
  useEffect(() => {
    if (!searchTerm.trim()) {
      if (hasSearched) {
        setDoctors([]);
        setHasSearched(false);
      }
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setHasSearched(true);
      try {
        const results = await profileService.searchDoctors(searchTerm.trim());
        setDoctors(results);
      } catch {
        // Global error handler shows toast
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, hasSearched]);

  const handleOpenBooking = useCallback(
    async (doctor: DoctorSearchResponse) => {
      setSelectedDoctor(doctor);
      setBookingDate("");
      setBookingStartTime("");
      setBookingEndTime("");
      setLoadingAvailability(true);
      try {
        const avail = await profileService.getDoctorAvailability(
          doctor.userId
        );
        setAvailability(avail);
      } catch {
        // Global error handler shows toast
        setAvailability([]);
      } finally {
        setLoadingAvailability(false);
      }
    },
    []
  );

  const handleBook = async () => {
    if (!user || !selectedDoctor || !bookingDate || !bookingStartTime || !bookingEndTime) {
      toast.error("Please fill in all booking fields.");
      return;
    }

    setIsBooking(true);
    try {
      await appointmentService.create({
        patientId: user.id,
        doctorId: selectedDoctor.userId,
        startTime: `${bookingDate}T${bookingStartTime}:00`,
        endTime: `${bookingDate}T${bookingEndTime}:00`,
      });
      toast.success("Appointment requested successfully!");
      setSelectedDoctor(null);
    } catch {
      // Global error handler shows toast
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Find Doctors"
        description="Search for doctors by specialization and book an appointment."
      />

      {/* Search Input */}
      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id="doctor-search-input"
          placeholder="Search by specialization (e.g. Cardiology, Dermatology...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-11"
        />
      </div>

      {/* Results */}
      {loading ? (
        <LoadingSkeleton variant="card" count={6} />
      ) : !hasSearched ? (
        <EmptyState
          icon={Stethoscope}
          title="Search for a specialist"
          description="Enter a specialization to find available doctors."
        />
      ) : doctors.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No doctors found"
          description={`No doctors found for "${searchTerm}". Try a different specialization.`}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doc) => (
            <DoctorCard
              key={doc.userId}
              doctor={doc}
              onBook={() => handleOpenBooking(doc)}
            />
          ))}
        </div>
      )}

      {/* Booking Dialog */}
      <Dialog
        open={!!selectedDoctor}
        onOpenChange={(open) => !open && setSelectedDoctor(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Book Appointment</DialogTitle>
            <DialogDescription>
              Schedule an appointment with Dr.{" "}
              {selectedDoctor ? getDisplayName(namesMap, selectedDoctor.userId) : ""}
            </DialogDescription>
          </DialogHeader>

          {/* Doctor Info */}
          {selectedDoctor && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50/50 border border-blue-100">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Stethoscope className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {selectedDoctor.specialization}
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedDoctor.experienceYears} years experience
                </p>
              </div>
            </div>
          )}

          {/* Availability */}
          {loadingAvailability ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
              <span className="text-sm text-muted-foreground">
                Loading availability...
              </span>
            </div>
          ) : availability.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                Available Hours
              </p>
              <div className="flex flex-wrap gap-2">
                {availability.map((slot) => (
                  <Badge
                    key={slot.id}
                    variant="outline"
                    className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs py-1 px-2.5"
                  >
                    <CalendarDays className="h-3 w-3 mr-1" />
                    {DAYS_OF_WEEK[slot.dayOfWeek]}
                    <Clock className="h-3 w-3 mx-1" />
                    {slot.startTime}–{slot.endTime}
                  </Badge>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-2">
              No availability data. You can still request an appointment.
            </p>
          )}

          {/* Booking Form */}
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="booking-date">Date</Label>
              <Input
                id="booking-date"
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="booking-start">Start Time</Label>
                <Input
                  id="booking-start"
                  type="time"
                  value={bookingStartTime}
                  onChange={(e) => setBookingStartTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="booking-end">End Time</Label>
                <Input
                  id="booking-end"
                  type="time"
                  value={bookingEndTime}
                  onChange={(e) => setBookingEndTime(e.target.value)}
                />
              </div>
            </div>
            <Button
              id="confirm-booking-btn"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleBook}
              disabled={
                isBooking ||
                !bookingDate ||
                !bookingStartTime ||
                !bookingEndTime
              }
            >
              {isBooking && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Request Appointment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
