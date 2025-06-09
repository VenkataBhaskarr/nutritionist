import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import api from "@/lib/api";
import { Calendar, ClipboardList, TrendingUp, User } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {toast} from "sonner"

interface Props {
  nutritionistEmail: string;
  onSuccess?: () => void;
}

const ContactNutritionistDialog: React.FC<Props> = ({
  nutritionistEmail,
  onSuccess,
}) => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nutritionistId, setNutritionistId] = useState<number | null>(null);
  const [nutritionistName, setNutritionistName] = useState("")
  const [clientId, setClientId] = useState<string>("");
  const [isInitialized, setIsInitialized] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Only fetch if we have valid user and token
    if (!user?.email || !token || !nutritionistEmail) {
      setError("Authentication required");
      return;
    }

    const fetchIds = async () => {
      try {
        setError(""); // Clear previous errors
        
        const clientRes = await api.get("/client/email", {
          params: { email: user.email },
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!clientRes.data || !clientRes.data[0]) {
          throw new Error("Client data not found");
        }

        setClientId(clientRes.data[0].id);

        const nutRes = await api.get("/nuts/id", {
          params: { id: clientRes.data[0].nId },
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!nutRes.data || !nutRes.data[0]) {
          throw new Error("Nutritionist data not found");
        }

        setNutritionistId(nutRes.data[0].id);
        setNutritionistName(nutRes.data[0].name);
        setIsInitialized(true);
      } catch (err) {
        console.error("Error fetching IDs:", err);
        setError("Unable to fetch contact information. Please try again.");
      }
    };

    fetchIds();
  }, [user?.email, token, nutritionistEmail]); // Added proper dependencies

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError("Message cannot be empty.");
      return;
    }
    if (!nutritionistId || !clientId) {
      setError("Missing user info. Try again later.");
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post(
        "/client/sendMessage",
        {
          nId: nutritionistId,
          cId: clientId,
          content: message.trim(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("");
      setError("");
      onSuccess?.();
      toast.success("Message sent successfully!");
    } catch (err) {
      console.error("Message send failed:", err);
      setError("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-primary-500 hover:bg-primary-600">
          Contact Nutritionist
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Message {nutritionistName || "Nutritionist"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-sm">Email</Label>
            <p className="text-sm text-muted-foreground">{nutritionistEmail}</p>
          </div>

          <div>
            <Label htmlFor="message">Your Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="mt-1"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button
            type="submit"
            disabled={isSubmitting || !isInitialized}
            className="w-full bg-primary-500 hover:bg-primary-600"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [clientData, setClientData] = useState<any>({});
  const [nutData, setNutData] = useState<any>({});
  const [progressData, setProgressData] = useState([]);
  const [mealPlan, setMealPlan] = useState([]);
  const [appointment, setAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const user = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        // Check authentication first
        if (!user || !token) {
          navigate("/login");
          return;
        }

        let parsedUser;
        try {
          parsedUser = JSON.parse(user);
        } catch (parseError) {
          console.error("Error parsing user data:", parseError);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        if (!parsedUser?.email) {
          console.error("Invalid user data");
          navigate("/login");
          return;
        }

        // Fetch client data
        const clientRes = await api.get("/client/email", {
          params: { email: parsedUser.email },
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!clientRes.data || !clientRes.data[0]) {
          throw new Error("Client data not found");
        }

        const client = clientRes.data[0];
        setClientData(client);

        // Fetch nutritionist data
        if (client.nId) {
          const nutRes = await api.get("/nuts/id", {
            params: { id: client.nId },
            headers: { Authorization: `Bearer ${token}` },
          });

          if (nutRes.data && nutRes.data[0]) {
            setNutData(nutRes.data[0]);
          }
        }

        // Fetch progress data
        if (client.id) {
          try {
            const progressRes = await api.get(`/client/progress`, {
              params: { id: client.id },
              headers: { Authorization: `Bearer ${token}` },
            });
            setProgressData(progressRes.data || []);
          } catch (progressError) {
            console.warn("Error fetching progress data:", progressError);
            setProgressData([]);
          }

          // Fetch meal plan
          try {
            const mealPlanRes = await api.get(`/client/meal`, {
              params: { id: client.id },
              headers: { Authorization: `Bearer ${token}` },
            });
            setMealPlan(mealPlanRes.data || []);
          } catch (mealError) {
            console.warn("Error fetching meal plan:", mealError);
            setMealPlan([]);
          }
        }

        setAppointment(client.nextSession);
        
      } catch (err: any) {
        console.error("Error loading client dashboard:", err);
        
        // Handle authentication errors
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        
        setError("Failed to load dashboard data. Please refresh the page or try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []); // Empty dependency array is fine here since we're checking localStorage inside

  // Show loading state
  if (loading) {
    return (
      <DashboardLayout title="Client Dashboard" userRole="client">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p>Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <DashboardLayout title="Client Dashboard" userRole="client">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Client Dashboard" userRole="client">
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h2 className="text-2xl font-bold mb-2">Welcome back, {clientData.name || "User"}!</h2>
                <p className="text-gray-600">Your {clientData.plan || "nutrition"} plan is making great progress. Keep it up!</p>
              </div>
              <div className="mt-4 md:mt-0">
                {nutData.email && (
                  <ContactNutritionistDialog nutritionistEmail={nutData.email} />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Next Appointment" icon={<Calendar />} value={appointment || "N/A"} sub={appointment?.time || ""} />
          <StatCard title="Current Plan" icon={<ClipboardList />} value={clientData.plan || "Not Set"} />
          <StatCard title="Progress" icon={<TrendingUp />} value={`${getWeightLoss(progressData)} lbs`} sub="Last 4 weeks" />
          <StatCard title="Nutritionist" icon={<User />} value={nutData.name || "Not Assigned"} sub={nutData.specialization || ""} />
        </div>

        {/* Graph & Meal Plan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProgressGraph progress={progressData} />
          <MealPlanSection meals={mealPlan} nutName={nutData.name || "Your Nutritionist"} />
        </div>

        {/* Nutritionist Details */}
        {nutData.name && (
          <Card>
            <CardHeader><CardTitle>Your Nutritionist</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="md:w-1/4 mb-4 md:mb-0 flex justify-center">
                  <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="h-12 w-12 text-primary-500" />
                  </div>
                </div>
                <div className="md:w-3/4">
                  <h3 className="text-xl font-bold mb-2">{nutData.name}</h3>
                  <p className="text-gray-600 mb-4">Email: {nutData.email}</p>
                  <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                    <ContactNutritionistDialog nutritionistEmail={nutData.email} />
                    <Button onClick={() => window.open('https://meet.google.com/landing', '_blank')} className="bg-primary-500">
                      Schedule G-Meet
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClientDashboard;

// Subcomponents
const StatCard = ({ title, icon, value, sub }: any) => (
  <Card className="border-l-4 border-l-primary-500">
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex justify-between items-center">
        <div>
          <div className="text-xl font-bold">{value}</div>
          <div className="text-gray-500 text-sm">{sub}</div>
        </div>
        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
          {React.cloneElement(icon, { className: "h-6 w-6 text-primary-500" })}
        </div>
      </div>
    </CardContent>
  </Card>
);

const ProgressGraph = ({ progress }: { progress: any[] }) => {
  if (!progress.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
          <CardDescription>Tracking over the past 4 weeks</CardDescription>
        </CardHeader>
        <CardContent className="text-center text-gray-500 py-16">
          No progress data available, Contact Nutritionist.
        </CardContent>
      </Card>
    );
  }

  const weights = progress.map((p) => p.weight);
  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);

  const range = maxWeight - minWeight || 1; // Prevent divide-by-zero
  const baseHeight = 20; // Minimum bar height in px

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Progress</CardTitle>
        <CardDescription>Progress tracking over the past 4 weeks (in kg)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-end space-x-4 justify-around">
          {progress.map((p, i) => {
            const relativeHeight = ((p.weight - minWeight) / range) * 100;
            return (
              <div
                key={i}
                className="flex-1 flex flex-col items-center h-64"
              >
                <div
                  className="bg-green-500 w-full rounded-t-md"
                  style={{
                    height: `calc(${baseHeight}px + ${relativeHeight}%)`,
                    minHeight: `${baseHeight}px`,
                    transition: "height 0.3s ease-in-out",
                  }}
                />
                <div className="mt-2 text-xs font-semibold">{p.week}</div>
                <div className="text-sm">{p.weight} kg</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

const MealPlanSection = ({ meals, nutName }: { meals: any[], nutName: string }) => {
  if(!meals.length){
    return (
      <Card>
        <CardHeader>
          <CardTitle>Today's Meal Plan</CardTitle>
          <CardDescription>Recommended by {nutName}</CardDescription>
        </CardHeader>
        <CardContent className="text-center text-gray-500 py-16">
          No Meal Plans available, Contact Nutritionist.
        </CardContent>
      </Card>
    )
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Meal Plan</CardTitle>
        <CardDescription>Recommended by {nutName}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {meals.map((meal, i) => (
          <div key={i} className="flex items-start">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mt-1 mr-3">
              <span className="text-primary-500 text-sm font-bold">{meal.meal[0]}</span>
            </div>
            <div>
              <h4 className="font-medium">{meal.meal}</h4>
              <p className="text-gray-600">{meal.food}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
};

const getWeightLoss = (progress: any[]) => {
  if (progress.length < 2) return 0;
  const first = progress[0]?.weight || 0;
  const last = progress[progress.length - 1]?.weight || 0;
  return Math.abs(first - last);
};