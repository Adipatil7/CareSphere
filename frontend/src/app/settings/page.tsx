"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Palette, Shield } from "lucide-react";

const sections = [
  {
    icon: Shield,
    title: "Account",
    description: "Manage your email, password, and security settings.",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Configure how and when you receive notifications.",
  },
  {
    icon: Palette,
    title: "Preferences",
    description: "Customize your experience and display settings.",
  },
];

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-12 md:px-6">
        <PageHeader
          title="Settings"
          description="Manage your account preferences."
        />
        <div className="mt-6 space-y-4">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Card key={section.title} className="border border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-3 text-base">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <Icon className="h-4 w-4" />
                    </div>
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {section.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
          <p className="text-xs text-muted-foreground text-center pt-4">
            More settings coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}
