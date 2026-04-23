"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { useAuth } from "@/hooks/useAuth";
import { pharmacyService } from "@/services/pharmacy.service";
import type { InventoryResponse } from "@/types";
import { useRouter } from "next/navigation";
import {
  Package,
  ClipboardCheck,
  Pill,
  TrendingUp,
  ArrowRight,
  Activity,
} from "lucide-react";

export default function ChemistDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [inventory, setInventory] = useState<InventoryResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchInventory = async () => {
      try {
        const data = await pharmacyService.getChemistInventory(user.id);
        setInventory(data);
      } catch {
        // Global error handler shows toast
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [user]);

  const totalMedicines = inventory.length;
  const totalStock = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockItems = inventory.filter((item) => item.quantity < 10);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.name ?? "Chemist"}!`}
        description="Manage your pharmacy inventory and fulfill prescriptions."
      />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border border-border shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Pill className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {loading ? "—" : totalMedicines}
                </p>
                <p className="text-xs text-muted-foreground">Total Medicines</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {loading ? "—" : totalStock}
                </p>
                <p className="text-xs text-muted-foreground">Total Stock Units</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {loading ? "—" : lowStockItems.length}
                </p>
                <p className="text-xs text-muted-foreground">Low Stock Items</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card
          className="border border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
          onClick={() => router.push("/chemist/inventory")}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                  <Package className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Manage Inventory
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Add medicines, update stock levels
                  </p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
          </CardContent>
        </Card>

        <Card
          className="border border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
          onClick={() => router.push("/chemist/fulfill")}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                  <ClipboardCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Fulfill Prescriptions
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Process and fulfill patient prescriptions
                  </p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {!loading && lowStockItems.length > 0 && (
        <Card className="border border-amber-200 bg-amber-50/30 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="h-4 w-4 text-amber-600" />
              <h3 className="font-semibold text-amber-800 text-sm">
                Low Stock Alert
              </h3>
            </div>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
              {lowStockItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-amber-100"
                >
                  <span className="text-sm font-medium text-foreground capitalize">
                    {item.medicineName}
                  </span>
                  <span className="text-xs font-semibold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                    {item.quantity} left
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
