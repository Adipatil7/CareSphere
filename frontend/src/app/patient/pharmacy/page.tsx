"use client";

import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { pharmacyService } from "@/services/pharmacy.service";
import { useUserNames, getDisplayName } from "@/hooks/useUserNames";
import type { InventoryResponse } from "@/types";
import {
  Search,
  Pill,
  Package,
  User,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function PatientPharmacyPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<InventoryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const chemistIds = useMemo(() => results.map((r) => r.chemistId), [results]);
  const namesMap = useUserNames(chemistIds);

  // Debounced search
  useEffect(() => {
    if (!searchTerm.trim()) {
      if (hasSearched) {
        setResults([]);
        setHasSearched(false);
      }
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setHasSearched(true);
      try {
        const data = await pharmacyService.searchMedicine(searchTerm.trim());
        setResults(data);
      } catch {
        // Global error handler shows toast
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, hasSearched]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pharmacy"
        description="Search for medicines and check availability at nearby pharmacies."
      />

      {/* Search Input */}
      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id="pharmacy-search-input"
          placeholder="Search by medicine name (e.g. Paracetamol, Amoxicillin...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-11"
        />
      </div>

      {/* Results */}
      {loading ? (
        <LoadingSkeleton variant="card" count={4} />
      ) : !hasSearched ? (
        <EmptyState
          icon={Pill}
          title="Search for a medicine"
          description="Enter a medicine name to see availability at pharmacies."
        />
      ) : results.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No results found"
          description={`No pharmacies found with "${searchTerm}". Try a different medicine name.`}
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {results.map((item) => {
            const inStock = item.quantity > 0;

            return (
              <Card
                key={item.id}
                className="border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          inStock
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-red-50 text-red-500"
                        }`}
                      >
                        <Pill className="h-5 w-5" />
                      </div>
                      <div className="space-y-1 min-w-0">
                        <p className="font-medium text-foreground text-sm">
                          {item.medicineName}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span>Chemist: {getDisplayName(namesMap, item.chemistId)}</span>
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`shrink-0 text-xs ${
                        inStock
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-red-50 text-red-600 border-red-200"
                      }`}
                    >
                      {inStock ? (
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 mr-1" />
                      )}
                      {inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
                    <div className="flex items-center gap-1.5 text-sm">
                      <Package className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">Qty:</span>
                      <span
                        className={`font-semibold ${
                          inStock ? "text-foreground" : "text-red-500"
                        }`}
                      >
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>
                        Updated{" "}
                        {new Date(item.lastUpdated).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" }
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
