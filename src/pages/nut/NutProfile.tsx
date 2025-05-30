import { FC, useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import DashboardLayout from '@/components/DashboardLayout';
import axios from 'axios';
import { toast } from "sonner";
import api from '@/lib/api';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface NutritionistProfile {
  name: string;
  email: string;
  specialization: string;
  experience: string;
  qualifications: string[];
  bio: string;
  profileImg: string
}

const NutProfile: FC = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleUpdatePassword = async () => {
    if (!password || !confirmPassword) {
      toast.error("Please fill in both fields.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      await api.post(
        "/nuts/updatepassword",
        {
          email: user.email,
          password: password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Password updated successfully!");
      setOpen(false);
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error updating password", error);
      toast.error("Something went wrong. Try again.");
    }
  };


const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    const validTypes = ['image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      toast.error('Only JPG and PNG formats are allowed.');
      return;
    }

    if (file.size > 1024 * 1024) {
      toast.error('Image must be less than 1MB.');
      return;
    }
    setImagePreview(URL.createObjectURL(file));
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  }
};

const triggerFileInput = () => {
  fileInputRef.current?.click();
};
  const [profile, setProfile] = useState<NutritionistProfile>({
    name: "Dr. Sarah Smith",
    email: "sarah.smith@example.com",
    specialization: "Sports Nutrition",
    experience: "8 years",
    qualifications: [
      "Ph.D. in Nutrition Science",
      "Certified Sports Nutritionist",
      "Clinical Dietitian License"
    ],
    profileImg: profileImage,
    bio: "Experienced nutritionist specializing in sports nutrition and performance enhancement. Passionate about helping athletes achieve their peak performance through optimal nutrition strategies."
  });

  const [newQualification, setNewQualification] = useState("");

  const handleInputChange = (field: keyof NutritionistProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleQualificationAdd = () => {
    if (newQualification.trim()) {
      setProfile(prev => ({
        ...prev,
        qualifications: [...prev.qualifications, newQualification.trim()]
      }));
      setNewQualification("");
    }
  };

  const handleQualificationRemove = (index: number) => {
    setProfile(prev => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index)
    }));
  };
  
  const handleSave = async () => {
    try {
      console.log(profile)
      await api.put("/api/nutritionist/profile", profile);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to save profile:", error);
      toast.error("Failed to update profile.");
    }
  };

  return (
    <DashboardLayout title="My Profile" userRole="nutritionist">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Profile Management</h1>
          <Button onClick={handleSave} className="bg-primary-500">Save Changes</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center mb-4">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="object-cover w-full h-full" />
                  ) : (
                    <span className="text-4xl text-gray-500">
                      {profile.name.split(" ").map(word => word[0]).join("").substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                />
                <Button variant="outline" size="sm" onClick={triggerFileInput}>
                  Change Photo
                </Button>
              </CardContent>
            </Card>
          <Card className="mt-7">
            <CardHeader>
              <CardTitle>Update Password</CardTitle>
            </CardHeader>
            <CardContent>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive">Please update your password here</Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4 py-2">
                    {/* New Password Field */}
                    <div className="space-y-1">
                      <Label htmlFor="new-password">New Password</Label>
                      <div className="relative">
                        <Input
                          id="new-password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-2 flex items-center text-muted-foreground"
                          onClick={() => setShowPassword((prev) => !prev)}
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-1">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="confirm-password"
                          type={showConfirm ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-2 flex items-center text-muted-foreground"
                          onClick={() => setShowConfirm((prev) => !prev)}
                          tabIndex={-1}
                        >
                          {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button onClick={handleUpdatePassword}>Update</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="font-medium">Full Name</label>
                    <input 
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={profile.name}
                      onChange={e => handleInputChange("name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-medium">Email</label>
                    <input 
                      type="email"
                      className="w-full p-2 border rounded-md"
                      value={profile.email}
                      onChange={e => handleInputChange("email", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="font-medium">Specialization</label>
                  <input 
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={profile.specialization}
                    onChange={e => handleInputChange("specialization", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-medium">Professional Bio</label>
                  <textarea 
                    className="w-full p-2 border rounded-md h-32"
                    value={profile.bio}
                    onChange={e => handleInputChange("bio", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Qualifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile.qualifications.map((qual, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <span>{qual}</span>
                    <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleQualificationRemove(index)}>Remove</Button>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newQualification}
                    onChange={e => setNewQualification(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    placeholder="Add new qualification"
                  />
                  <Button variant="outline" size="sm" onClick={handleQualificationAdd}>Add</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          
        </div>
        
      </div>
    </DashboardLayout>
  );
};

export default NutProfile;
