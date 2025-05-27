import React, { FC, useEffect, useState, Component, ReactNode } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DashboardLayout from '@/components/DashboardLayout';
import api from "@/lib/api";
import { useNavigate } from 'react-router-dom';

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
  type: string;
  target: string;
  progress: number;
  deadline: string;
}

interface ClientInfo {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  age: number;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !target || !deadline) {
      setError("Type, target, and deadline are required.");
      return;
    }
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      const navigate = useNavigate();
      if(!token){
        navigate("/login")
      }
      await api.post(
        "/goals",
        { clientId, type, target, progress: parseFloat(progress), deadline },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setError("");
      setType("");
      setTarget("");
      setProgress("0");
      setDeadline("");
      onSuccess?.();
      alert("Goal added successfully!");
    } catch (err) {
      setError("Failed to add goal. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full border-primary-500 text-primary-500 hover:bg-primary-50">
          Add New Goal
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Goal</DialogTitle>
        </DialogHeader>
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
          <Button type="submit" disabled={isSubmitting} className="w-full bg-primary-500 hover:bg-primary-600">
            {isSubmitting ? "Adding..." : "Add Goal"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const AddMetricDialog: FC<{
  clientId: number;
  onSuccess?: () => void;
}> = ({ clientId, onSuccess }) => {
  const [date, setDate] = useState("");
  const [weight, setWeight] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [calories, setCalories] = useState("");
  const [water, setWater] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !weight) {
      setError("Date and weight are required.");
      return;
    }
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      const navigate = useNavigate();
   if(!token){
    navigate("/login")
   }
      await api.post(
        "/progress",
        {
          clientId,
          date,
          weight: parseFloat(weight),
          bodyFat: bodyFat ? parseFloat(bodyFat) : null,
          calories: calories ? parseInt(calories) : null,
          water: water ? parseFloat(water) : null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setError("");
      setDate("");
      setWeight("");
      setBodyFat("");
      setCalories("");
      setWater("");
      onSuccess?.();
      alert("Metric added successfully!");
    } catch (err) {
      setError("Failed to add metric. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full border-primary-500 text-primary-500 hover:bg-primary-50">
          Add New Measurement
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Progress Metric</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="bodyFat">Body Fat (%)</Label>
            <Input
              id="bodyFat"
              type="number"
              step="0.1"
              value={bodyFat}
              onChange={(e) => setBodyFat(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="calories">Calories (kcal)</Label>
            <Input
              id="calories"
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="water">Water Intake (L)</Label>
            <Input
              id="water"
              type="number"
              step="0.1"
              value={water}
              onChange={(e) => setWater(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" disabled={isSubmitting} className="w-full bg-primary-500 hover:bg-primary-600">
            {isSubmitting ? "Adding..." : "Add Metric"}
          </Button>
        </form>
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
    issue: {},
  });
  const [goals, setGoals] = useState<Goal[]>([]);
  const [metrics, setMetrics] = useState<ProgressMetric[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const navigate = useNavigate();
           if(!token){
            navigate("/login")
           }
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const email = encodeURIComponent(user.email);

        // Fetch client info
        const clientResponse = await api.get(`/client/email`, {
          params: { email },
          headers: { Authorization: `Bearer ${token}` },
        });
        setClientInfo({
          id: clientResponse.data[0].id,
          name: clientResponse.data[0].name,
          email: clientResponse.data[0].email,
          phone: clientResponse.data[0].phone,
          address: clientResponse.data[0].location,
          age: clientResponse.data[0].age,
          issue: clientResponse.data[0].issue || {},
        });

        // Fetch goals
        const goalsResponse = await api.get(`/goals/client`, {
          params: { clientId: clientResponse.data[0].id },
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Goals response:', goalsResponse.data); // Debug log
        setGoals(Array.isArray(goalsResponse.data) ? goalsResponse.data : []);

        // Fetch progress metrics
        const metricsResponse = await api.get(`/progress/client`, {
          params: { clientId: clientResponse.data[0].id },
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Metrics response:', metricsResponse.data); // Debug log
        setMetrics(Array.isArray(metricsResponse.data) ? metricsResponse.data : []);
      } catch (err) {
        console.error('Fetch error:', err);
        setError("Failed to fetch data. Please try again.");
        setGoals([]); // Ensure goals is an array
        setMetrics([]); // Ensure metrics is an array
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      const navigate = useNavigate();
      if(!token){
        navigate("/login")
      }
      await api.put(
        `/client/${clientInfo.id}`,
        {
          name: clientInfo.name,
          email: clientInfo.email,
          phone: clientInfo.phone,
          location: clientInfo.address,
          age: clientInfo.age,
          issue: clientInfo.issue,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Profile updated successfully!");
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title="My Profile" userRole="client">
        <div className="p-4">Loading...</div>
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
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Personal Info */}
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                      <span className="text-4xl text-primary-500">
                        {clientInfo.name ? clientInfo.name.slice(0, 2).toUpperCase() : "JD"}
                      </span>
                    </div>
                    <Button variant="outline" size="sm" className="border-primary-500 text-primary-500 hover:bg-primary-50">
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
                        value={clientInfo.issue.height || ""}
                        onChange={(e) =>
                          setClientInfo({
                            ...clientInfo,
                            issue: { ...clientInfo.issue, height: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight</Label>
                      <Input
                        id="weight"
                        value={clientInfo.issue.weight || ""}
                        onChange={(e) =>
                          setClientInfo({
                            ...clientInfo,
                            issue: { ...clientInfo.issue, weight: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="diet">Diet Type</Label>
                      <select
                        id="diet"
                        className="w-full p-2 border rounded-md"
                        value={clientInfo.issue.diet || ""}
                        onChange={(e) =>
                          setClientInfo({
                            ...clientInfo,
                            issue: { ...clientInfo.issue, diet: e.target.value },
                          })
                        }
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
                        value={clientInfo.issue.allergies?.join(", ") || ""}
                        onChange={(e) =>
                          setClientInfo({
                            ...clientInfo,
                            issue: {
                              ...clientInfo.issue,
                              allergies: e.target.value.split(",").map((a) => a.trim()),
                            },
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
                      goals.map((goal) => (
                        <div key={goal.id} className="p-4 bg-primary-50 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-medium">{goal.type}</h3>
                              <p className="text-sm text-gray-500">{goal.target} • Due {goal.deadline}</p>
                            </div>
                            <Button variant="ghost" size="sm" className="text-primary-500 hover:bg-primary-100">
                              Update
                            </Button>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-primary-500 h-2.5 rounded-full"
                              style={{ width: `${goal.progress}%` }}
                            />
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{goal.progress}% completed</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No goals found.</p>
                    )}
                    <AddGoalDialog clientId={clientInfo.id} onSuccess={() => window.location.reload()} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Progress Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {metrics.length > 0 ? (
                      metrics.map((metric) => (
                        <div key={metric.id} className="p-4 bg-primary-50 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium">{metric.date}</h3>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Weight</p>
                              <p className="font-medium">{metric.weight} kg</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Body Fat</p>
                              <p className="font-medium">{metric.bodyFat ? `${metric.bodyFat}%` : '-'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Calories</p>
                              <p className="font-medium">{metric.calories ? `${metric.calories} kcal` : '-'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Water</p>
                              <p className="font-medium">{metric.water ? `${metric.water} L` : '-'}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No progress metrics found.</p>
                    )}
                    <AddMetricDialog clientId={clientInfo.id} onSuccess={() => window.location.reload()} />
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
