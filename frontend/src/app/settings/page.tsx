"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/common/PageHeader";
import { useAuth } from "@/hooks/useAuth";
import {
  User,
  Bell,
  Palette,
  Shield,
  Globe,
  Moon,
} from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();

  const sections = [
    {
      icon: User,
      title: "Account",
      description: "Manage your account settings and preferences",
      color: "bg-blue-50 text-blue-600",
      items: [
        { label: "Email", value: user?.email ?? "—" },
        { label: "Phone", value: user?.phone ?? "—" },
        { label: "Role", value: user?.role ?? "—" },
      ],
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Configure how you receive notifications",
      color: "bg-amber-50 text-amber-600",
      items: [
        { label: "Email Notifications", value: "Coming soon" },
        { label: "Push Notifications", value: "Coming soon" },
        { label: "SMS Alerts", value: "Coming soon" },
      ],
    },
    {
      icon: Palette,
      title: "Preferences",
      description: "Customize your experience",
      color: "bg-violet-50 text-violet-600",
      items: [
        { label: "Theme", value: "Light" },
        { label: "Language", value: "English" },
        { label: "Time Zone", value: Intl.DateTimeFormat().resolvedOptions().timeZone },
      ],
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "Manage your privacy and security settings",
      color: "bg-emerald-50 text-emerald-600",
      items: [
        { label: "Two-Factor Authentication", value: "Coming soon" },
        { label: "Active Sessions", value: "1 active" },
        { label: "Data Export", value: "Coming soon" },
      ],
    },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-6 px-4">
      <PageHeader
        title="Settings"
        description="Manage your account settings and preferences."
      />

      <div className="space-y-4">
        {sections.map((section) => (
          <Card key={section.title} className="border border-border shadow-sm">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${section.color}`}
                >
                  <section.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">
                    {section.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {section.description}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                {section.items.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between py-1"
                  >
                    <p className="text-sm text-muted-foreground">
                      {item.label}
                    </p>
                    {item.value === "Coming soon" ? (
                      <Badge
                        variant="outline"
                        className="bg-slate-50 text-slate-500 border-slate-200 text-xs"
                      >
                        Coming soon
                      </Badge>
                    ) : (
                      <p className="text-sm font-medium text-foreground">
                        {item.value}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
