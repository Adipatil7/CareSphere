"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/common/PageHeader";
import { useAuth } from "@/hooks/useAuth";
import { pharmacyService } from "@/services/pharmacy.service";
import type { FulfillmentResponse } from "@/types";
import { toast } from "sonner";
import {
  ClipboardCheck,
  Search,
  Loader2,
  CheckCircle2,
  Package,
  Clock,
  User,
} from "lucide-react";

export default function ChemistFulfillPage() {
  const { user } = useAuth();

  // Fulfill form
  const [prescriptionId, setPrescriptionId] = useState("");
  const [isFulfilling, setIsFulfilling] = useState(false);
  const [fulfillResult, setFulfillResult] =
    useState<FulfillmentResponse | null>(null);

  // Status check
  const [statusPrescriptionId, setStatusPrescriptionId] = useState("");
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [statusResult, setStatusResult] =
    useState<FulfillmentResponse | null>(null);

  const handleFulfill = async () => {
    if (!user || !prescriptionId.trim()) return;
    setIsFulfilling(true);
    setFulfillResult(null);
    try {
      const result = await pharmacyService.fulfillPrescription(
        prescriptionId.trim(),
        user.id
      );
      setFulfillResult(result);
      toast.success("Prescription fulfilled successfully!");
      setPrescriptionId("");
    } catch {
      // Global error handler shows toast
    } finally {
      setIsFulfilling(false);
    }
  };

  const handleCheckStatus = async () => {
    if (!statusPrescriptionId.trim()) return;
    setIsCheckingStatus(true);
    setStatusResult(null);
    try {
      const result = await pharmacyService.getFulfillmentStatus(
        statusPrescriptionId.trim()
      );
      setStatusResult(result);
    } catch {
      // Global error handler shows toast
    } finally {
      setIsCheckingStatus(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Prescription Fulfillment"
        description="Fulfill patient prescriptions and check fulfillment status."
      />

      <div className="grid gap-6 md:grid-cols-2 max-w-3xl">
        {/* Fulfill Prescription */}
        <Card className="border border-border shadow-sm">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <ClipboardCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Fulfill Prescription
                </h3>
                <p className="text-xs text-muted-foreground">
                  Enter a prescription ID to fulfill it
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="prescription-id" className="text-xs">
                  Prescription ID
                </Label>
                <Input
                  id="prescription-id"
                  placeholder="Enter prescription ID..."
                  value={prescriptionId}
                  onChange={(e) => setPrescriptionId(e.target.value)}
                  className="h-9"
                  onKeyDown={(e) => e.key === "Enter" && handleFulfill()}
                />
              </div>
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={handleFulfill}
                disabled={isFulfilling || !prescriptionId.trim()}
              >
                {isFulfilling && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Fulfill Prescription
              </Button>
            </div>

            {/* Fulfill Result */}
            {fulfillResult && (
              <>
                <Separator />
                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <p className="text-sm font-medium text-emerald-800">
                      Prescription Fulfilled
                    </p>
                  </div>
                  <div className="space-y-1 text-xs text-emerald-700">
                    <p>
                      <span className="font-medium">Fulfillment ID:</span>{" "}
                      {fulfillResult.id.slice(0, 12)}...
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>{" "}
                      <Badge
                        variant="outline"
                        className="bg-emerald-100 text-emerald-800 border-emerald-300 text-[10px] py-0"
                      >
                        {fulfillResult.status}
                      </Badge>
                    </p>
                    <p>
                      <span className="font-medium">Updated:</span>{" "}
                      {new Date(fulfillResult.updatedAt).toLocaleString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Check Status */}
        <Card className="border border-border shadow-sm">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Search className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Check Status
                </h3>
                <p className="text-xs text-muted-foreground">
                  Look up a prescription&apos;s fulfillment status
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="status-prescription-id" className="text-xs">
                  Prescription ID
                </Label>
                <Input
                  id="status-prescription-id"
                  placeholder="Enter prescription ID..."
                  value={statusPrescriptionId}
                  onChange={(e) => setStatusPrescriptionId(e.target.value)}
                  className="h-9"
                  onKeyDown={(e) => e.key === "Enter" && handleCheckStatus()}
                />
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleCheckStatus}
                disabled={isCheckingStatus || !statusPrescriptionId.trim()}
              >
                {isCheckingStatus && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Check Status
              </Button>
            </div>

            {/* Status Result */}
            {statusResult && (
              <>
                <Separator />
                <div className="p-4 rounded-lg bg-slate-50 border border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">
                      Fulfillment Details
                    </p>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        statusResult.status === "FULFILLED"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {statusResult.status}
                    </Badge>
                  </div>
                  <div className="space-y-1.5 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Package className="h-3 w-3" />
                      <span>
                        Prescription:{" "}
                        {statusResult.prescriptionId.slice(0, 12)}...
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User className="h-3 w-3" />
                      <span>
                        Chemist: {statusResult.chemistId.slice(0, 12)}...
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      <span>
                        Updated:{" "}
                        {new Date(statusResult.updatedAt).toLocaleString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
