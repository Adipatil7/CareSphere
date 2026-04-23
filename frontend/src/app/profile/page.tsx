"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { PageHeader } from "@/components/common/PageHeader";
import { useAuth } from "@/hooks/useAuth";
import { profileService } from "@/services/profile.service";
import type { DoctorProfileResponse } from "@/types";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  Stethoscope,
  Award,
  FileText,
  Edit3,
  X,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const [doctorProfile, setDoctorProfile] =
    useState<DoctorProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Edit form state
  const [editLicense, setEditLicense] = useState("");
  const [editSpecialization, setEditSpecialization] = useState("");
  const [editExperience, setEditExperience] = useState("");
  const [editBio, setEditBio] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        if (user.role === "DOCTOR") {
          const profile = await profileService.getProfile(user.id);
          const dp = profile as DoctorProfileResponse;
          setDoctorProfile(dp);
          setEditLicense(dp.licenseNumber || "");
          setEditSpecialization(dp.specialization || "");
          setEditExperience(String(dp.experienceYears || ""));
          setEditBio(dp.bio || "");
        }
      } catch {
        // Profile might not exist yet, that's OK
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const updated = await profileService.updateDoctorProfile(user.id, {
        licenseNumber: editLicense,
        specialization: editSpecialization,
        experienceYears: parseInt(editExperience) || 0,
        bio: editBio,
      });
      setDoctorProfile(updated);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch {
      // Global error handler shows toast
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (doctorProfile) {
      setEditLicense(doctorProfile.licenseNumber || "");
      setEditSpecialization(doctorProfile.specialization || "");
      setEditExperience(String(doctorProfile.experienceYears || ""));
      setEditBio(doctorProfile.bio || "");
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 py-6 px-4">
        <PageHeader title="Profile" description="Manage your account details." />
        <LoadingSkeleton variant="card" count={2} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-6 px-4">
      <PageHeader title="Profile" description="Manage your account details." />

      {/* User Info Card */}
      <Card className="border border-border shadow-sm">
        <CardContent className="p-6 space-y-5">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 text-2xl font-bold">
              {user?.name?.charAt(0).toUpperCase() ?? "U"}
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {user?.name}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 text-xs"
                >
                  <Shield className="h-3 w-3 mr-1" />
                  {user?.role}
                </Badge>
                {user?.verified && (
                  <Badge
                    variant="outline"
                    className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs"
                  >
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium text-foreground">
                  {user?.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-sm font-medium text-foreground">
                  {user?.phone}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Joined</p>
                <p className="text-sm font-medium text-foreground">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Doctor Profile Card */}
      {user?.role === "DOCTOR" && (
        <Card className="border border-border shadow-sm">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <Stethoscope className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Doctor Profile
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Professional information
                  </p>
                </div>
              </div>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit3 className="h-3.5 w-3.5 mr-1.5" />
                  Edit
                </Button>
              )}
            </div>

            <Separator />

            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-license" className="text-sm">
                      License Number
                    </Label>
                    <Input
                      id="edit-license"
                      value={editLicense}
                      onChange={(e) => setEditLicense(e.target.value)}
                      placeholder="Medical license #"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-specialization" className="text-sm">
                      Specialization
                    </Label>
                    <Input
                      id="edit-specialization"
                      value={editSpecialization}
                      onChange={(e) => setEditSpecialization(e.target.value)}
                      placeholder="e.g. Cardiology"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-experience" className="text-sm">
                    Years of Experience
                  </Label>
                  <Input
                    id="edit-experience"
                    type="number"
                    value={editExperience}
                    onChange={(e) => setEditExperience(e.target.value)}
                    placeholder="e.g. 10"
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-bio" className="text-sm">
                    Bio
                  </Label>
                  <Textarea
                    id="edit-bio"
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="Tell patients about yourself..."
                    rows={3}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                  >
                    <X className="h-3.5 w-3.5 mr-1" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving && (
                      <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid gap-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      License Number
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {doctorProfile?.licenseNumber || "Not set"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Stethoscope className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Specialization
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {doctorProfile?.specialization || "Not set"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Experience</p>
                    <p className="text-sm font-medium text-foreground">
                      {doctorProfile?.experienceYears
                        ? `${doctorProfile.experienceYears} years`
                        : "Not set"}
                    </p>
                  </div>
                </div>
                {doctorProfile?.bio && (
                  <div className="flex items-start gap-3">
                    <User className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Bio</p>
                      <p className="text-sm text-foreground">
                        {doctorProfile.bio}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
