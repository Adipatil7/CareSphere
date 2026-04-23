"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { useAuth } from "@/hooks/useAuth";
import { pharmacyService } from "@/services/pharmacy.service";
import type { InventoryResponse } from "@/types";
import { toast } from "sonner";
import {
  Package,
  Plus,
  Search,
  Pill,
  RefreshCw,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  User,
} from "lucide-react";

export default function ChemistInventoryPage() {
  const { user } = useAuth();
  const [inventory, setInventory] = useState<InventoryResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Add inventory form
  const [addMedicineName, setAddMedicineName] = useState("");
  const [addQuantity, setAddQuantity] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Update inventory form
  const [updateMedicineName, setUpdateMedicineName] = useState("");
  const [updateQuantity, setUpdateQuantity] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Search
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<InventoryResponse[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchInventory = async () => {
    if (!user) return;
    try {
      const data = await pharmacyService.getChemistInventory(user.id);
      setInventory(data);
    } catch {
      // Global error handler shows toast
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddInventory = async () => {
    if (!user || !addMedicineName.trim() || !addQuantity) return;
    setIsAdding(true);
    try {
      await pharmacyService.addInventory({
        chemistId: user.id,
        medicineName: addMedicineName.trim(),
        quantity: parseInt(addQuantity, 10),
      });
      toast.success(`Added ${addMedicineName} to inventory!`);
      setAddMedicineName("");
      setAddQuantity("");
      fetchInventory();
    } catch {
      // Global error handler shows toast
    } finally {
      setIsAdding(false);
    }
  };

  const handleUpdateInventory = async () => {
    if (!user || !updateMedicineName.trim() || updateQuantity === "") return;
    setIsUpdating(true);
    try {
      await pharmacyService.updateInventory({
        chemistId: user.id,
        medicineName: updateMedicineName.trim(),
        quantity: parseInt(updateQuantity, 10),
      });
      toast.success(`Updated ${updateMedicineName} stock!`);
      setUpdateMedicineName("");
      setUpdateQuantity("");
      fetchInventory();
    } catch {
      // Global error handler shows toast
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setIsSearching(true);
    setHasSearched(true);
    try {
      const data = await pharmacyService.searchMedicine(searchTerm.trim());
      setSearchResults(data);
    } catch {
      // Global error handler shows toast
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory Management"
        description="Manage your pharmacy stock and search for medicines."
      />

      <Tabs defaultValue="my-stock" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-lg">
          <TabsTrigger value="my-stock" className="text-sm">
            My Stock ({inventory.length})
          </TabsTrigger>
          <TabsTrigger value="add-update" className="text-sm">
            Add / Update
          </TabsTrigger>
          <TabsTrigger value="search" className="text-sm">
            Search All
          </TabsTrigger>
        </TabsList>

        {/* My Stock Tab */}
        <TabsContent value="my-stock" className="mt-4">
          {loading ? (
            <LoadingSkeleton variant="card" count={4} />
          ) : inventory.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No inventory yet"
              description="Add medicines to your inventory to get started."
            />
          ) : (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {inventory.map((item) => {
                const inStock = item.quantity > 0;
                const isLow = item.quantity > 0 && item.quantity < 10;

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
                              isLow
                                ? "bg-amber-50 text-amber-600"
                                : inStock
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-red-50 text-red-500"
                            }`}
                          >
                            <Pill className="h-5 w-5" />
                          </div>
                          <div className="space-y-1 min-w-0">
                            <p className="font-medium text-foreground text-sm capitalize">
                              {item.medicineName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Qty: <span className="font-semibold">{item.quantity}</span>
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={`shrink-0 text-xs ${
                            isLow
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : inStock
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-red-50 text-red-600 border-red-200"
                          }`}
                        >
                          {isLow ? (
                            <>
                              <Clock className="h-3 w-3 mr-1" />
                              Low
                            </>
                          ) : inStock ? (
                            <>
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              In Stock
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 mr-1" />
                              Out
                            </>
                          )}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
                        <Clock className="h-3 w-3" />
                        <span>
                          Updated{" "}
                          {new Date(item.lastUpdated).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" }
                          )}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Add/Update Tab */}
        <TabsContent value="add-update" className="mt-4">
          <div className="grid gap-6 md:grid-cols-2 max-w-3xl">
            {/* Add New Stock */}
            <Card className="border border-border shadow-sm">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Plus className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Add Stock
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Add a new medicine or add to existing
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Medicine Name</Label>
                    <Input
                      placeholder="e.g. Paracetamol"
                      value={addMedicineName}
                      onChange={(e) => setAddMedicineName(e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      placeholder="e.g. 100"
                      value={addQuantity}
                      onChange={(e) => setAddQuantity(e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={handleAddInventory}
                    disabled={
                      isAdding || !addMedicineName.trim() || !addQuantity
                    }
                  >
                    {isAdding && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Add to Inventory
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Update Stock */}
            <Card className="border border-border shadow-sm">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <RefreshCw className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Update Stock
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Set the exact quantity for a medicine
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Medicine Name</Label>
                    <Input
                      placeholder="e.g. Amoxicillin"
                      value={updateMedicineName}
                      onChange={(e) => setUpdateMedicineName(e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">New Quantity</Label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="e.g. 50"
                      value={updateQuantity}
                      onChange={(e) => setUpdateQuantity(e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleUpdateInventory}
                    disabled={
                      isUpdating ||
                      !updateMedicineName.trim() ||
                      updateQuantity === ""
                    }
                  >
                    {isUpdating && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Update Stock
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Search Tab */}
        <TabsContent value="search" className="mt-4">
          <div className="space-y-4">
            <div className="flex gap-2 max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search medicine name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={isSearching || !searchTerm.trim()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Search"
                )}
              </Button>
            </div>

            {isSearching ? (
              <LoadingSkeleton variant="card" count={3} />
            ) : !hasSearched ? (
              <EmptyState
                icon={Search}
                title="Search for medicines"
                description="Search to see availability across all pharmacies."
              />
            ) : searchResults.length === 0 ? (
              <EmptyState
                icon={Search}
                title="No results found"
                description={`No pharmacies found with "${searchTerm}".`}
              />
            ) : (
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {searchResults.map((item) => {
                  const inStock = item.quantity > 0;
                  const isMe = item.chemistId === user?.id;

                  return (
                    <Card
                      key={item.id}
                      className={`border shadow-sm ${
                        isMe
                          ? "border-blue-200 bg-blue-50/20"
                          : "border-border"
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-sm capitalize text-foreground">
                            {item.medicineName}
                          </p>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              inStock
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-red-50 text-red-600 border-red-200"
                            }`}
                          >
                            {inStock ? "In Stock" : "Out"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {isMe ? "Your Pharmacy" : `Chemist: ${item.chemistId.slice(0, 8)}...`}
                          </span>
                          <span className="font-semibold">
                            Qty: {item.quantity}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
