"use client";

import { useState } from "react";
import { Sidebar, type NavItem } from "./Sidebar";
import { Navbar } from "./Navbar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Search,
  Calendar,
  FileText,
  Pill,
  Users,
  Package,
  ClipboardCheck,
} from "lucide-react";
import type { Role } from "@/types";

const PATIENT_NAV: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/patient/dashboard" },
  { icon: Search, label: "Find Doctors", href: "/patient/doctors" },
  { icon: Calendar, label: "Appointments", href: "/patient/appointments" },
  { icon: FileText, label: "Medical Records", href: "/patient/records" },
  { icon: Pill, label: "Pharmacy", href: "/patient/pharmacy" },
  { icon: Users, label: "Community", href: "/patient/community" },
];

const DOCTOR_NAV: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/doctor/dashboard" },
  { icon: Calendar, label: "Appointments", href: "/doctor/appointments" },
  { icon: FileText, label: "Medical Records", href: "/doctor/records" },
  { icon: Users, label: "Community", href: "/doctor/community" },
];

const CHEMIST_NAV: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/chemist/dashboard" },
  { icon: Package, label: "Inventory", href: "/chemist/inventory" },
  { icon: ClipboardCheck, label: "Prescriptions", href: "/chemist/fulfill" },
];

interface DashboardLayoutProps {
  role: Role;
  children: React.ReactNode;
}

export function DashboardLayout({ role, children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navItems = role === "DOCTOR" ? DOCTOR_NAV : role === "CHEMIST" ? CHEMIST_NAV : PATIENT_NAV;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:shrink-0">
        <Sidebar items={navItems} />
      </aside>

      {/* Mobile Sidebar Drawer */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar items={navItems} onNavigate={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar onMenuToggle={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
