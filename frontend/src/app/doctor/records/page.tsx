"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/common/PageHeader";
import { useAuth } from "@/hooks/useAuth";
import { recordsService } from "@/services/records.service";
import { useUserNames, getDisplayName } from "@/hooks/useUserNames";
import type { VisitResponse } from "@/types";
import { toast } from "sonner";
import {
  FileText,
  Plus,
  Trash2,
  Loader2,
  ClipboardList,
  Pill,
  CheckCircle2,
} from "lucide-react";

interface MedicineRow {
  name: string;
  dosage: string;
  duration: string;
  instructions: string;
}

const emptyMedicine = (): MedicineRow => ({
  name: "",
  dosage: "",
  duration: "",
  instructions: "",
});

export default function DoctorRecordsPage() {
  const { user } = useAuth();

  // Visit form state
  const [consultId, setConsultId] = useState("");
  const [patientId, setPatientId] = useState("");
  const [notes, setNotes] = useState("");
  const [isCreatingVisit, setIsCreatingVisit] = useState(false);
  const [createdVisit, setCreatedVisit] = useState<VisitResponse | null>(null);

  // Prescription form state
  const [medicines, setMedicines] = useState<MedicineRow[]>([emptyMedicine()]);
  const [isCreatingPrescription, setIsCreatingPrescription] = useState(false);
  const [prescriptionCreated, setPrescriptionCreated] = useState(false);

  const handleCreateVisit = async () => {
    if (!user || !consultId.trim() || !patientId.trim() || !notes.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsCreatingVisit(true);
    try {
      const visit = await recordsService.createVisit({
        consultId,
        doctorId: user.id,
        patientId,
        notes,
      });
      setCreatedVisit(visit);
      toast.success("Visit record created successfully!");
    } catch {
      // Global error handler shows toast
    } finally {
      setIsCreatingVisit(false);
    }
  };

  const handleAddMedicine = () => {
    setMedicines((prev) => [...prev, emptyMedicine()]);
  };

  const handleRemoveMedicine = (index: number) => {
    if (medicines.length === 1) return;
    setMedicines((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (
    index: number,
    field: keyof MedicineRow,
    value: string
  ) => {
    setMedicines((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m))
    );
  };

  const handleCreatePrescription = async () => {
    if (!createdVisit) return;

    const validMedicines = medicines.filter((m) => m.name.trim());
    if (validMedicines.length === 0) {
      toast.error("Add at least one medicine.");
      return;
    }

    setIsCreatingPrescription(true);
    try {
      await recordsService.createPrescription({
        visitId: createdVisit.id,
        medicines: validMedicines.map((m) => ({
          name: m.name,
          dosage: m.dosage,
          duration: m.duration,
          instructions: m.instructions || undefined,
        })),
      });
      setPrescriptionCreated(true);
      toast.success("Prescription created successfully!");
    } catch {
      // Global error handler shows toast
    } finally {
      setIsCreatingPrescription(false);
    }
  };

  const handleReset = () => {
    setConsultId("");
    setPatientId("");
    setNotes("");
    setCreatedVisit(null);
    setMedicines([emptyMedicine()]);
    setPrescriptionCreated(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Medical Records"
        description="Create visit notes and prescriptions for your patients."
      />

      <div className="max-w-2xl space-y-6">
        {/* Step 1: Create Visit Record */}
        <Card className="border border-border shadow-sm">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                  createdVisit
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-blue-50 text-blue-600"
                }`}
              >
                {createdVisit ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <ClipboardList className="h-5 w-5" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Step 1: Create Visit Record
                </h3>
                <p className="text-xs text-muted-foreground">
                  Document the consultation details
                </p>
              </div>
            </div>

            {createdVisit ? (
              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                <p className="text-sm font-medium text-emerald-800">
                  ✓ Visit record created
                </p>
                <p className="text-xs text-emerald-600 mt-1">
                  Visit ID: {createdVisit.id.slice(0, 12)}...
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="consult-id">Consultation ID</Label>
                    <Input
                      id="consult-id"
                      placeholder="Enter consultation ID"
                      value={consultId}
                      onChange={(e) => setConsultId(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patient-id">Patient ID</Label>
                    <Input
                      id="patient-id"
                      placeholder="Enter patient ID"
                      value={patientId}
                      onChange={(e) => setPatientId(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visit-notes">Notes</Label>
                  <Textarea
                    id="visit-notes"
                    placeholder="Describe the patient's condition, diagnosis, and recommendations..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                  />
                </div>
                <Button
                  id="create-visit-btn"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={handleCreateVisit}
                  disabled={
                    isCreatingVisit ||
                    !consultId.trim() ||
                    !patientId.trim() ||
                    !notes.trim()
                  }
                >
                  {isCreatingVisit && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Visit Record
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step 2: Add Prescription */}
        <Card
          className={`border shadow-sm transition-opacity ${
            createdVisit
              ? "border-border opacity-100"
              : "border-dashed border-slate-200 opacity-50 pointer-events-none"
          }`}
        >
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                  prescriptionCreated
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-violet-50 text-violet-600"
                }`}
              >
                {prescriptionCreated ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <Pill className="h-5 w-5" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Step 2: Add Prescription
                </h3>
                <p className="text-xs text-muted-foreground">
                  Prescribe medicines for this visit
                </p>
              </div>
            </div>

            {prescriptionCreated ? (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                  <p className="text-sm font-medium text-emerald-800">
                    ✓ Prescription created with {medicines.filter((m) => m.name.trim()).length} medicine(s)
                  </p>
                </div>
                <Button variant="outline" onClick={handleReset}>
                  Create Another Record
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Medicine Rows */}
                {medicines.map((med, index) => (
                  <div key={index} className="space-y-3">
                    {index > 0 && <Separator />}
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">
                        Medicine {index + 1}
                      </p>
                      {medicines.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleRemoveMedicine(index)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Medicine Name</Label>
                        <Input
                          placeholder="e.g. Amoxicillin"
                          value={med.name}
                          onChange={(e) =>
                            handleMedicineChange(index, "name", e.target.value)
                          }
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Dosage</Label>
                        <Input
                          placeholder="e.g. 500mg"
                          value={med.dosage}
                          onChange={(e) =>
                            handleMedicineChange(
                              index,
                              "dosage",
                              e.target.value
                            )
                          }
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Duration</Label>
                        <Input
                          placeholder="e.g. 7 days"
                          value={med.duration}
                          onChange={(e) =>
                            handleMedicineChange(
                              index,
                              "duration",
                              e.target.value
                            )
                          }
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Instructions</Label>
                        <Input
                          placeholder="e.g. After meals"
                          value={med.instructions}
                          onChange={(e) =>
                            handleMedicineChange(
                              index,
                              "instructions",
                              e.target.value
                            )
                          }
                          className="h-9"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  className="border-dashed"
                  onClick={handleAddMedicine}
                >
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Add Medicine
                </Button>

                <Separator />

                <Button
                  id="create-prescription-btn"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={handleCreatePrescription}
                  disabled={
                    isCreatingPrescription ||
                    medicines.every((m) => !m.name.trim())
                  }
                >
                  {isCreatingPrescription && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Prescription
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
