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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const triggerFileInput = () => fileInputRef.current?.click();

  // Helper function to validate authentication
  const validateAuth = () => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    
    if (!token || !userStr) {
      throw new Error("Authentication required. Please log in again.");
    }
    
    try {
      const user = JSON.parse(userStr);
      if (!user.email) {
        throw new Error("Invalid user data. Please log in again.");
      }
      return { token, user };
    } catch (parseError) {
      throw new Error("Invalid authentication data. Please log in again.");
    }
  };

  useEffect(() => {
    const fetchNutritionist = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Add a small delay to ensure localStorage is ready after page refresh
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const { token, user } = validateAuth();

        const res = await api.get(`/nuts/email`, {
          params: { email: user.email },
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.data || !Array.isArray(res.data) || res.data.length === 0) {
          throw new Error("No profile data found.");
        }

        const data = res.data[0];
        setProfile({
          name: data.name || "",
          email: data.email || user.email,
          specialization: data.specialization || "",
          experience: data.experience || "",
          qualifications: Array.isArray(data.qualifications) ? data.qualifications : [],
          bio: data.bio || "",
          profilePicture: data.profilePicture || "",
        });

        setProfileImage(data.profilePicUrl || null);
      } catch (error: any) {
        console.error("Failed to fetch nutritionist profile", error);
        const errorMessage = error.response?.data?.message || error.message || "Error loading profile.";
        setError(errorMessage);
        toast.error(errorMessage);
        
        // If authentication error, you might want to redirect to login
        if (errorMessage.includes("Authentication") || errorMessage.includes("log in")) {
          // Uncomment and modify based on your routing setup
          // window.location.href = '/login';
          // or router.push('/login');
        }
      } finally {
        setIsLoading(false);
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
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
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
  };

  const handleSave = async () => {
    try {
      setIsUploading(true);
      const { token } = validateAuth();

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

      await api.post("/nuts/updateProfile", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Profile updated successfully!");
      // Clear the image file after successful upload
      setImageFile(null);
      setImagePreview(null);
    } catch (err: any) {
      console.error("Failed to save profile:", err);
      const errorMessage = err.response?.data?.message || "Update failed.";
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!password || !confirmPassword) {
      toast.error("Please fill in both fields.");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    try {
      const { token, user } = validateAuth();

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
    } catch (err: any) {
      console.error("Error updating password", err);
      const errorMessage = err.response?.data?.message || "Something went wrong.";
      toast.error(errorMessage);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <DashboardLayout title="My Profile" userRole="nutritionist">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout title="My Profile" userRole="nutritionist">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
                    <img 
                      src={imagePreview || profileImage} 
                      className="object-cover w-full h-full" 
                      alt="Profile"
                      onError={(e) => {
                        // Handle broken image
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="text-4xl text-gray-500">
                      {profile.name?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "NU"}
                    </span>
                  )}
                </div>
                <input 
                  ref={fileInputRef} 
                  type="file" 
                  accept="image/jpeg,image/png,image/jpg" 
                  className="hidden" 
                  onChange={handleImageChange} 
                />
                <Button onClick={triggerFileInput} variant="outline" size="sm">
                  Change Photo
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Update Password</CardTitle></CardHeader>
              <CardContent>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive">Update Password</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Change Password</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-2">
                      <div>
                        <Label htmlFor="new-password">New Password</Label>
                        <div className="relative">
                          <Input 
                            id="new-password"
                            type={showPassword ? "text" : "password"} 
                            value={password} 
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Enter new password"
                          />
                          <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)} 
                            className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <div className="relative">
                          <Input 
                            id="confirm-password"
                            type={showConfirm ? "text" : "password"} 
                            value={confirmPassword} 
                            onChange={e => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                          />
                          <button 
                            type="button" 
                            onClick={() => setShowConfirm(!showConfirm)} 
                            className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                          >
                            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleUpdatePassword}>Update Password</Button>
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
                  <div>
                    <Label>Full Name</Label>
                    <Input 
                      value={profile.name} 
                      onChange={e => handleInputChange("name", e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input 
                      value={profile.email} 
                      readOnly 
                      className="bg-gray-50"
                    />
                  </div>
                </div>
                <div>
                  <Label>Specialization</Label>
                  <Input 
                    value={profile.specialization} 
                    onChange={e => handleInputChange("specialization", e.target.value)}
                    placeholder="e.g., Sports Nutrition, Clinical Nutrition"
                  />
                </div>
                <div>
                  <Label>Experience</Label>
                  <Input 
                    value={profile.experience} 
                    onChange={e => handleInputChange("experience", e.target.value)}
                    placeholder="e.g., 5 years"
                  />
                </div>
                <div>
                  <Label>Bio</Label>
                  <textarea 
                    className="w-full p-2 border rounded-md h-32 resize-none" 
                    value={profile.bio} 
                    onChange={e => handleInputChange("bio", e.target.value)}
                    placeholder="Tell us about yourself and your expertise..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator />
      </div>
    </DashboardLayout>
  );
};

export default NutProfile;