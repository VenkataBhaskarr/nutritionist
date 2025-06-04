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

const ScheduleAppointmentDialog: React.FC<{
  clientId: number;
  nutritionistId: number;
  onSuccess?: () => void;
}> = ({ clientId, nutritionistId, onSuccess }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) {
      setError("Date and time are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      if(!token){
        navigate("/login")
      }
      await api.post(
        "/appointments",
        { clientId, date, time, nutritionistId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setError("");
      setDate("");
      setTime("");
      onSuccess?.();
      alert("Appointment scheduled successfully!");
    } catch (err) {
      setError("Failed to schedule appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-primary-500 text-primary-500 hover:bg-primary-50">
          Schedule Appointment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Appointment</DialogTitle>
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
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" disabled={isSubmitting} className="w-full bg-primary-500 hover:bg-primary-600">
            {isSubmitting ? "Scheduling..." : "Schedule"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Contact Nutritionist Dialog Component
const ContactNutritionistDialog: React.FC<{
  nutritionistEmail: string;
  onSuccess?: () => void;
}> = ({ nutritionistEmail, onSuccess }) => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) {
      setError("Message is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      await api.post(
        "/contact",
        {
          message,
          contactMethod: "email",
          recipient: nutritionistEmail,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setError("");
      setMessage("");
      onSuccess?.();
      alert("Message sent successfully!");
    } catch (err) {
      setError("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-primary-500 hover:bg-primary-600">Contact Nutritionist</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contact Your Nutritionist</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Contact Method</Label>
            <div className="flex items-center">
              <span>Email: {nutritionistEmail}</span>
            </div>
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 border rounded-md"
              rows={4}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" disabled={isSubmitting} className="w-full bg-primary-500 hover:bg-primary-600">
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

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const user = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!user || !token) return navigate("/login");

        const parsedUser = JSON.parse(user);
        const clientRes = await api.get("/client/email", {
          params: { email: parsedUser.email },
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(clientRes.data[0])
        const client = clientRes.data[0];
        setClientData(client);

        const nutRes = await api.get("/nuts/id", {
          params: { id: client.nId },
          headers: { Authorization: `Bearer ${token}` },
        });

        setNutData(nutRes.data[0]);

        // const progressRes = await api.get(`/client/progress`, {
        //   params: {id: client.id},
        //   headers: { Authorization: `Bearer ${token}` },
        // });

        const dummyProgressData =  [
          { week: "Week 1", weight: 100 },
          { week: "Week 2", weight: 90 },
          { week: "Week 3", weight: 80 },
          { week: "Week 4", weight: 65 },
        ]
        //setProgressData(progressRes.data || []);
        setProgressData(dummyProgressData)
        console.log(progressData)

        const mealPlanRes = await api.get(`/mealplan/${client.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMealPlan(mealPlanRes.data || []);

        const appointmentRes = await api.get(`/appointments/latest/${client.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointment(appointmentRes.data);
      } catch (err) {
        console.error("Error loading client dashboard", err);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout title="Client Dashboard" userRole="client">
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h2 className="text-2xl font-bold mb-2">Welcome back, {clientData.name}!</h2>
                <p className="text-gray-600">Your {clientData.plan} plan is making great progress. Keep it up!</p>
              </div>
              <div className="mt-4 md:mt-0">
                <ContactNutritionistDialog nutritionistEmail={nutData.email} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Next Appointment" icon={<Calendar />} value={appointment?.date || "N/A"} sub={appointment?.time || ""} />
          <StatCard title="Current Plan" icon={<ClipboardList />} value={clientData.plan} sub={`Started ${clientData.startDate}`} />
          <StatCard title="Progress" icon={<TrendingUp />} value={`-${getWeightLoss(progressData)} lbs`} sub="Last 4 weeks" />
          <StatCard title="Nutritionist" icon={<User />} value={nutData.name} sub={nutData.specialization || ""} />
        </div>

        {/* Graph & Meal Plan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProgressGraph progress={progressData} />
          <MealPlanSection meals={mealPlan} nutName={nutData.name} />
        </div>

        {/* Nutritionist Details */}
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
                  <ScheduleAppointmentDialog clientId={clientData.id} nutritionistId={nutData.id} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
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
          No progress data available.
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
const MealPlanSection = ({ meals, nutName }: { meals: any[], nutName: string }) => (
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
);

const getWeightLoss = (progress: any[]) => {
  if (progress.length < 2) return 0;
  const first = progress[0]?.weight || 0;
  const last = progress[progress.length - 1]?.weight || 0;
  return Math.abs(first - last);
};


