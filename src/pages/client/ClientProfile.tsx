import React, { FC, useEffect, useState, Component, ReactNode, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DashboardLayout from '@/components/DashboardLayout';
import api from "@/lib/api";
import { useNavigate } from 'react-router-dom';
import { Weight } from 'lucide-react';
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-red-500">
          Something went wrong. Please try refreshing the page.
        </div>
      );
    }
    return this.props.children;
  }
}

interface ProgressMetric {
  id: number;
  date: string;
  weight: number;
  bodyFat?: number;
  calories?: number;
  water?: number;
}

interface Goal {
  id: number;
  title: string;
  target: string;
  progress: number;
  deadline: string;
  isComplete: boolean;
}

interface ClientInfo {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  age: number;
  height: number;
  weight: number;
  diet: string;
  profilePicture?: string;
  allergies: string;
  issue: {
    height?: string;
    weight?: string;
    diet?: string;
    allergies?: string[];
  };
}

const AddGoalDialog: FC<{
  clientId: number;
  onSuccess?: () => void;
}> = ({ clientId, onSuccess }) => {
  const [type, setType] = useState("");
  const [target, setTarget] = useState("");
  const [progress, setProgress] = useState("0");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasGoal, setHasGoal] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const checkGoal = async () => {
      try {
        const res = await api.get(`/client/goal`, {
          params: { clientId },
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.length > 0) {
          setHasGoal(true);
        } else {
          setHasGoal(false);
        }
      } catch (err) {
        console.error("Error checking existing goals:", err);
      }
    };

    if (dialogOpen) {
      checkGoal();
    }
  }, [clientId, token, dialogOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!type || !target || !deadline) {
      setError("Type, target, and deadline are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      if (!token) {
        navigate("/login");
        return;
      }

      await api.post(
        "/client/goal",
        { clientId, type, target, progress: parseFloat(progress), deadline },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setType("");
      setTarget("");
      setProgress("0");
      setDeadline("");
      setError("");
      toast.success("Goal added successfully!");
      onSuccess?.();
      setDialogOpen(false);
    } catch (err) {
      console.error(err);
      setError("Failed to add goal. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full border-primary-500 text-primary-500 hover:bg-primary-50"
        >
          Add New Goal
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Goal</DialogTitle>
        </DialogHeader>

        {hasGoal ? (
          <p className="text-sm text-red-500">
            You already have an active goal. Please complete or remove it first.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="type">Goal Type</Label>
              <Input
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="target">Target</Label>
              <Input
                id="target"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="progress">Progress (%)</Label>
              <Input
                id="progress"
                type="number"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-500 hover:bg-primary-600"
            >
              {isSubmitting ? "Adding..." : "Add Goal"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

const ClientProfile: FC = () => {
  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    id: 0,
    name: "",
    email: "",
    phone: "",
    address: "",
    age: 0,
    height: 0,
    weight: 0,
    diet: "",
    profilePicture: "",
    issue: {},
    allergies: "",
  });
  const [goals, setGoals] = useState<Goal[]>([]);
  const [metrics, setMetrics] = useState<ProgressMetric[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Image upload states - similar to NutProfile
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const navigate = useNavigate();

  const triggerFileInput = () => fileInputRef.current?.click();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(""); // Clear previous errors
        
        // Add a small delay to ensure localStorage is ready after refresh
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("user");

        // Better validation for token and user data
        if (!token || !userStr) {
          console.log("No token or user data found, redirecting to login");
          navigate("/login");
          return;
        }

        let user;
        try {
          user = JSON.parse(userStr);
        } catch (parseError) {
          console.error("Error parsing user data:", parseError);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        if (!user.email) {
          console.error("No email found in user data");
          navigate("/login");
          return;
        }

        const email = user.email;
        console.log("Fetching data for email:", email);
        
        // Fetch client info with better error handling
        const clientResponse = await api.get(`/client/email`, {
          params: { email },
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!clientResponse.data || !Array.isArray(clientResponse.data) || clientResponse.data.length === 0) {
          throw new Error("No client data found");
        }
        
        const clientData = clientResponse.data[0];
        
        // Validate client data
        if (!clientData.id) {
          throw new Error("Invalid client data received");
        }
        
        setClientInfo({
          id: clientData.id,
          name: clientData.name || "",
          email: clientData.email || "",
          phone: clientData.phone || "",
          address: clientData.location || "",
          age: clientData.age || 0,
          issue: clientData.issue || {},
          height: clientData.height || 0,
          weight: clientData.weight || 0,
          diet: clientData.diet || "",
          profilePicture: clientData.profilePicture || "",
          allergies: clientData.allergies || "",
        });

        // Set profile image if it exists
        setProfileImage(clientData.profilePicUrl || null);

        // Fetch goals with better error handling
        try {
          const goalsResponse = await api.get(`/client/goal`, {
            params: { clientId: clientData.id },
            headers: { Authorization: `Bearer ${token}` },
          });

          if (goalsResponse.data && Array.isArray(goalsResponse.data)) {
            const formattedGoals = goalsResponse.data.map((g) => ({
              ...g,
              isComplete: g.progress == "100" || g.progress === 100
            }));
            setGoals(formattedGoals);
            console.log("Goals loaded:", formattedGoals);
          } else {
            setGoals([]);
          }
        } catch (goalsError) {
          console.warn("Failed to fetch goals:", goalsError);
          setGoals([]);
          // Don't throw here, goals are not critical for profile loading
        }

        // Fetch progress metrics (if needed)
        // Add your metrics fetching logic here if required
        
      } catch (err: any) {
        console.error('Fetch error:', err);
        
        // Handle different types of errors
        if (err.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        } else if (err.response?.status === 404) {
          setError("Profile not found. Please contact support.");
        } else if (err.response?.status >= 500) {
          setError("Server error. Please try again later.");
        } else {
          setError("Failed to fetch data. Please try again.");
        }
        
        // Set default values to prevent UI crashes
        setGoals([]);
        setMetrics([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]); // Add navigate to dependency array

  const handleUpdateGoal = async (goal: Goal) => {
    const newProgress = prompt("Enter new progress (0 - 100):", goal.progress.toString());
    const progressValue = parseInt(newProgress || "", 10);

    if (isNaN(progressValue) || progressValue < 0 || progressValue > 100) {
      toast.error("Invalid progress value");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      await api.post(
        `/client/goal/update`,
        {
          goalId: goal.id,
          progress: progressValue,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Goal progress updated!");

      // Update in UI instantly
      setGoals((prev) =>
        prev.map((g) => 
          g.id === goal.id 
            ? { ...g, progress: progressValue, isComplete: progressValue === 100 } 
            : g
        )
      );
    } catch (err: any) {
      if (err.response?.status === 401) {
        navigate("/login");
        return;
      }
      toast.error("Failed to update goal");
      console.error(err);
    }
  };

  const handleRemoveGoal = async (goalId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      await api.delete(`/client/goal/`, {
        params: { goalId },
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Goal removed successfully!");

      // Instantly update UI by removing the goal
      setGoals((prev) => prev.filter((g) => g.id !== goalId));
    } catch (err: any) {
      if (err.response?.status === 401) {
        navigate("/login");
        return;
      }
      toast.error("Failed to remove goal");
      console.error(err);
    }
  };

  const handleCompleteGoal = async (goalId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      await api.post(
        `/client/goal/update`,
        {
          goalId,
          progress: 100,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Goal marked as complete!");

      confetti({
        particleCount: 200,
        spread: 80,
        origin: { y: 0.75 }, // Push confetti down
      });

      // Update in UI instantly
      setGoals((prev) =>
        prev.map((g) => 
          g.id === goalId 
            ? { ...g, progress: 100, isComplete: true } 
            : g
        )
      );
    } catch (err: any) {
      if (err.response?.status === 401) {
        navigate("/login");
        return;
      }
      toast.error("Failed to complete goal");
      console.error(err);
    }
  };

  // Image change handler - similar to NutProfile
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

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError(""); // Clear previous errors
      
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      console.log("Saving profile:", clientInfo);

      // Use FormData for multipart form data - similar to NutProfile
      const formData = new FormData();
      
      formData.append("name", clientInfo.name);
      formData.append("email", clientInfo.email);
      formData.append("phone", clientInfo.phone);
      formData.append("location", clientInfo.address);
      formData.append("age", clientInfo.age.toString());
      formData.append("height", clientInfo.height.toString());
      formData.append("Weight", clientInfo.weight.toString());
      formData.append("diet", clientInfo.diet);
      
      // Handle allergies
      const allergs = clientInfo.allergies;
      formData.append("allergies", allergs);

      // Add image file if it exists
      if (imageFile) {
        formData.append("profilePicture", imageFile);
      }

      await api.post(
        `/client/updateProfile`,
        formData,
        { 
          headers: { 
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}` 
          } 
        }
      );
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      console.error("Failed to save profile:", err);
      
      if (err.response?.status === 401) {
        navigate("/login");
        return;
      }
      
      const errorMessage = err.response?.data?.message || "Failed to update profile. Please try again.";
      setError(errorMessage);
      toast.error("Update failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <DashboardLayout title="My Profile" userRole="client">
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <ErrorBoundary>
      <DashboardLayout title="My Profile" userRole="client">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Profile Management</h1>
            <Button
              onClick={handleSaveChanges}
              disabled={isSubmitting}
              className="bg-primary-500 hover:bg-primary-600"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-700 text-sm">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2" 
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Personal Info */}
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full bg-primary-100 overflow-hidden flex items-center justify-center mb-4">
                      {imagePreview || profileImage ? (
                        <img 
                          src={imagePreview || profileImage} 
                          className="object-cover w-full h-full" 
                          alt="Profile" 
                        />
                      ) : (
                        <span className="text-4xl text-primary-500">
                          {clientInfo.name ? clientInfo.name.slice(0, 2).toUpperCase() : "JD"}
                        </span>
                      )}
                    </div>
                    <input 
                      ref={fileInputRef} 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageChange} 
                    />
                    <Button 
                      onClick={triggerFileInput}
                      variant="outline" 
                      size="sm" 
                      className="border-primary-500 text-primary-500 hover:bg-primary-50"
                    >
                      Change Photo
                    </Button>
                  </div>
                  <Separator />
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={clientInfo.name}
                        onChange={(e) => setClientInfo({ ...clientInfo, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        readOnly
                        value={clientInfo.email}
                        onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={clientInfo.phone}
                        onChange={(e) => setClientInfo({ ...clientInfo, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={clientInfo.address}
                        onChange={(e) => setClientInfo({ ...clientInfo, address: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Health Info + Goals + Metrics */}
            <div className="md:col-span-2">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Health Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={clientInfo.age || ""}
                        onChange={(e) => setClientInfo({ ...clientInfo, age: parseInt(e.target.value) || 0 })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Height</Label>
                      <Input
                        id="height"
                        value={clientInfo.height || ""}
                        onChange={(e) => setClientInfo({ ...clientInfo, height: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight</Label>
                      <Input
                        id="weight"
                        value={clientInfo.weight || ""}
                        onChange={(e) => setClientInfo({ ...clientInfo, weight: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="diet">Diet Type</Label>
                      <select
                        id="diet"
                        className="w-full p-2 border rounded-md"
                        value={clientInfo.diet || ""}
                        onChange={(e) => setClientInfo({ ...clientInfo, diet: e.target.value })}
                      >
                        <option value="">Select Diet</option>
                        <option value="Vegetarian">Vegetarian</option>
                        <option value="Vegan">Vegan</option>
                        <option value="Non-vegetarian">Non-vegetarian</option>
                        <option value="Pescatarian">Pescatarian</option>
                      </select>
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="allergies">Allergies (comma-separated)</Label>
                      <Input
                        id="allergies"
                        value={clientInfo.allergies}
                        onChange={(e) =>
                          setClientInfo({
                            ...clientInfo,
                            allergies: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Goals & Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {goals.length > 0 ? (
                      goals.map((goal) => {
                        return (
                          <motion.div
                            key={goal.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-4 rounded-lg shadow-sm transition-all duration-300 ${
                              goal.isComplete ? "bg-green-50 border border-green-200" : "bg-primary-50"
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex gap-2 items-start">
                                {goal.isComplete && (
                                  <div className="text-green-500 pt-0.5 text-xl">✅</div>
                                )}
                                <div>
                                  <h3 className="font-medium text-gray-800">{goal.title}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {goal.target} • Due {goal.deadline}
                                  </p>
                                </div>
                              </div>

                              <div className="flex gap-1">
                                {!goal.isComplete && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-primary-500 hover:bg-primary-100"
                                      onClick={() => handleUpdateGoal(goal)}
                                    >
                                      Update
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-primary-500 hover:bg-primary-100"
                                      onClick={() => handleCompleteGoal(goal.id)}
                                    >
                                      Complete
                                    </Button>
                                  </>
                                )}
                                {goal.isComplete && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-500 hover:bg-primary-100"
                                      onClick={() => handleRemoveGoal(goal.id)}
                                    >
                                      Delete
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>

                            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                              <div
                                className={`h-2.5 rounded-full transition-all duration-500 ${
                                  goal.isComplete ? "bg-green-400" : "bg-primary-500"
                                }`}
                                style={{ width: `${goal.progress}%` }}
                              />
                            </div>
                            <p
                              className={`text-sm mt-1 ${
                                goal.isComplete ? "text-green-600 font-medium" : "text-muted-foreground"
                              }`}
                            >
                              {goal.progress}% completed
                            </p>
                          </motion.div>
                        );
                      })
                    ) : (
                      <p className="text-gray-500">No goals found.</p>
                    )}

                    <AddGoalDialog 
                      clientId={clientInfo.id} 
                      onSuccess={() => {
                        // Instead of full page reload, refetch goals
                        const fetchGoals = async () => {
                          try {
                            const token = localStorage.getItem("token");
                            if (!token) return;
                            
                            const goalsResponse = await api.get(`/client/goal`, {
                              params: { clientId: clientInfo.id },
                              headers: { Authorization: `Bearer ${token}` },
                            });

                            if (goalsResponse.data && Array.isArray(goalsResponse.data)) {
                              const formattedGoals = goalsResponse.data.map((g) => ({
                                ...g,
                                isComplete: g.progress == "100" || g.progress === 100
                              }));
                              setGoals(formattedGoals);
                            }
                          } catch (error) {
                            console.error("Failed to refetch goals:", error);
                          }
                        };
                        fetchGoals();
                      }} 
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ErrorBoundary>
  );
};

export default ClientProfile;