"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { useAuth } from "@/hooks/useAuth";
import { useUserNames, getDisplayName } from "@/hooks/useUserNames";
import { recordsService } from "@/services/records.service";
import type { VisitResponse, PrescriptionResponse } from "@/types";
import {
  FileText,
  ChevronDown,
  ChevronUp,
  Pill,
  Calendar,
  User,
  Stethoscope,
  Loader2,
  ClipboardList,
} from "lucide-react";

export default function PatientRecordsPage() {
  const { user } = useAuth();
  const [records, setRecords] = useState<VisitResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [prescriptions, setPrescriptions] = useState<
    Record<string, PrescriptionResponse>
  >({});
  const [loadingPrescription, setLoadingPrescription] = useState<string | null>(
    null
  );

  const doctorIds = useMemo(() => records.map((r) => r.doctorId), [records]);
  const namesMap = useUserNames(doctorIds);

  useEffect(() => {
    if (!user) return;

    const fetchRecords = async () => {
      try {
        const data = await recordsService.getPatientRecords(user.id);
        setRecords(data);
      } catch {
        // Global error handler shows toast
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [user]);

  const handleToggle = async (record: VisitResponse) => {
    if (expandedId === record.id) {
      setExpandedId(null);
      return;
    }

    setExpandedId(record.id);

    // If prescription data is embedded in the record, use it
    if (record.prescription) {
      setPrescriptions((prev) => ({
        ...prev,
        [record.id]: record.prescription!,
      }));
      return;
    }

    // Otherwise try to fetch separately (if there's a prescription ID pattern)
    // For now, the prescription is expected to be part of the visit response
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Medical Records"
          description="View your visit history and prescriptions."
        />
        <LoadingSkeleton variant="card" count={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Medical Records"
        description="View your visit history and prescriptions."
      />

      {records.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No medical records yet"
          description="Your visit records and prescriptions will appear here after your consultations."
        />
      ) : (
        <div className="space-y-3">
          {records.map((record) => {
            const isExpanded = expandedId === record.id;
            const prescription = record.prescription || prescriptions[record.id];

            return (
              <Card
                key={record.id}
                className="border border-border shadow-sm overflow-hidden"
              >
                <CardContent className="p-0">
                  {/* Record Header — Clickable */}
                  <button
                    id={`record-toggle-${record.id}`}
                    className="w-full p-5 flex items-start justify-between gap-4 text-left hover:bg-muted/30 transition-colors"
                    onClick={() => handleToggle(record)}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                        <ClipboardList className="h-5 w-5" />
                      </div>
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-foreground text-sm">
                            Visit Record
                          </p>
                          {prescription && (
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700 border-blue-200 text-xs"
                            >
                              <Pill className="h-3 w-3 mr-1" />
                              Prescription
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(record.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            Dr. {getDisplayName(namesMap, record.doctorId)}
                          </span>
                        </div>
                        {!isExpanded && record.notes && (
                          <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                            {record.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0 mt-1">
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-5 pb-5 space-y-4 border-t border-border pt-4">
                      {/* Notes */}
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                          <Stethoscope className="h-4 w-4 text-muted-foreground" />
                          Doctor&apos;s Notes
                        </h4>
                        <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                          {record.notes || "No notes available."}
                        </p>
                      </div>

                      {/* Prescription */}
                      {loadingPrescription === record.id ? (
                        <div className="flex items-center gap-2 py-4">
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                          <span className="text-sm text-muted-foreground">
                            Loading prescription...
                          </span>
                        </div>
                      ) : prescription ? (
                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                            <Pill className="h-4 w-4 text-muted-foreground" />
                            Prescription
                          </h4>
                          <div className="rounded-lg border border-border overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-muted/50">
                                  <TableHead className="text-xs">
                                    Medicine
                                  </TableHead>
                                  <TableHead className="text-xs">
                                    Dosage
                                  </TableHead>
                                  <TableHead className="text-xs">
                                    Duration
                                  </TableHead>
                                  <TableHead className="text-xs">
                                    Instructions
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {prescription.medicines.map((med) => (
                                  <TableRow key={med.id}>
                                    <TableCell className="text-sm font-medium">
                                      {med.medicineName}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                      {med.dosage}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                      {med.duration}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                      {med.instructions || "—"}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <Badge
                              variant="outline"
                              className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs"
                            >
                              {prescription.status}
                            </Badge>
                            <span>
                              Issued{" "}
                              {new Date(
                                prescription.createdAt
                              ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">
                          No prescription issued for this visit.
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
