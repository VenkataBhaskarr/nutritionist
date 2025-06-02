import { FC, useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import DashboardLayout from '@/components/DashboardLayout';
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
  profilePicture?: string;
}

const NutProfile: FC = () => {
  const [profile, setProfile] = useState<NutritionistProfile>({
    name: "",
    email: "",
    specialization: "",
    experience: "",
    qualifications: [],
    bio: "",
    profilePicture: "",
  });

  const [newQualification, setNewQualification] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const triggerFileInput = () => fileInputRef.current?.click();

  useEffect(() => {
    const fetchNutritionist = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        const res = await api.get(`/nuts/email`, {
          params: { email: user.email },
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data[0];
        setProfile({
          ...data,
          qualifications: data.qualifications || [],
          profilePicture: data.profilePicture || "",
        });

        setProfileImage(data.profilePicUrl || null);
      } catch (error) {
        console.error("Failed to fetch nutritionist profile", error);
        toast.error("Error loading profile.");
      }
    };

    fetchNutritionist();
  }, []);

  const handleInputChange = (field: keyof NutritionistProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleQualificationAdd = () => {
    if (newQualification.trim()) {
      setProfile(prev => ({
        ...prev,
        qualifications: [...prev.qualifications, newQualification.trim()],
      }));
      setNewQualification("");
    }
  };

  const handleQualificationRemove = (index: number) => {
    setProfile(prev => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index),
    }));
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

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setIsUploading(true);
      const formData = new FormData();

      formData.append("name", profile.name);
      formData.append("email", profile.email);
      formData.append("specialization", profile.specialization);
      formData.append("experience", profile.experience);
      formData.append("bio", profile.bio);
      formData.append("qualifications", JSON.stringify(profile.qualifications));

      if (imageFile) {
        formData.append("profilePicture", imageFile);
      }

      const token = localStorage.getItem("token");

      await api.post("/nuts/updateProfile", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to save profile:", err);
      toast.error("Update failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!password || !confirmPassword) return toast.error("Please fill in both fields.");
    if (password !== confirmPassword) return toast.error("Passwords do not match.");

    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      await api.post("/nuts/updatepassword", {
        email: user.email,
        password,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Password updated successfully!");
      setOpen(false);
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Error updating password", err);
      toast.error("Something went wrong.");
    }
  };

  console.log(profile)

  return (
    <DashboardLayout title="My Profile" userRole="nutritionist">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Profile Management</h1>
          <Button 
            onClick={handleSave}
            className="bg-primary-500"
            disabled={isUploading}
          >
            {isUploading ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Picture and Password */}
          <div className="md:col-span-1 space-y-7">
            <Card>
              <CardHeader><CardTitle>Profile Picture</CardTitle></CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center mb-4">
                  {imagePreview || profileImage ? (
                    <img src={imagePreview || profileImage} className="object-cover w-full h-full" alt="Profile" />
                  ) : (
                    <span className="text-4xl text-gray-500">
                      {profile.name?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)}
                    </span>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                <Button onClick={triggerFileInput} variant="outline" size="sm">Change Photo</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Update Password</CardTitle></CardHeader>
              <CardContent>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive">Please update your password here</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Change Password</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-2">
                      <div>
                        <Label htmlFor="new-password">New Password</Label>
                        <div className="relative">
                          <Input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-2">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <div className="relative">
                          <Input type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                          <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-2 top-2">{showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}</button>
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

          {/* Personal Info */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Full Name</Label><Input value={profile.name} onChange={e => handleInputChange("name", e.target.value)} /></div>
                  <div><Label>Email</Label><Input value={profile.email} readOnly /></div>
                </div>
                <div><Label>Specialization</Label><Input value={profile.specialization} onChange={e => handleInputChange("specialization", e.target.value)} /></div>
                <div><Label>Experience</Label><Input value={profile.experience} onChange={e => handleInputChange("experience", e.target.value)} /></div>
                <div><Label>Bio</Label><textarea className="w-full p-2 border rounded-md h-32" value={profile.bio} onChange={e => handleInputChange("bio", e.target.value)} /></div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator />

        {/* Qualifications */}
        {/* <Card>
          <CardHeader><CardTitle>Qualifications</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profile.qualifications.map((q, i) => (
                <div key={i} className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                  <span>{q}</span>
                  <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleQualificationRemove(i)}>Remove</Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input placeholder="Add new qualification" value={newQualification} onChange={e => setNewQualification(e.target.value)} />
                <Button onClick={handleQualificationAdd} size="sm" variant="outline">Add</Button>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </DashboardLayout>
  );
};

export default NutProfile;
