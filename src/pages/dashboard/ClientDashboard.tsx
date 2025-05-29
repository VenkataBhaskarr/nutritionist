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

const MOCK_CLIENT = {
  id: 1,
  name: "Michael Brown",
  email: "michael@example.com",
  plan: "Weight Loss",
  startDate: "2023-04-01",
  nutritionist: {
    name: "Dr. Emma Smith",
    email: "emma@example.com",
    specialty: "Sports Nutrition",
  },
  nextAppointment: {
    date: "2023-05-20",
    time: "10:00 AM",
  },
  progress: [
    { week: "Week 1", weight: 180 },
    { week: "Week 2", weight: 178 },
    { week: "Week 3", weight: 177 },
    { week: "Week 4", weight: 175 },
  ],
  mealPlan: [
    { meal: "Breakfast", food: "Oatmeal with berries and nuts" },
    { meal: "Lunch", food: "Grilled chicken salad with olive oil dressing" },
    { meal: "Snack", food: "Greek yogurt with honey" },
    { meal: "Dinner", food: "Baked salmon with steamed vegetables" },
  ],
};

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
  const user = localStorage.getItem("user");
  const [clientData, setClientData] = useState(MOCK_CLIENT);
  const [nutData, setNutData] = useState({
    id: 0,
    name: "",
    email: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userJSONValue = JSON.parse(user || "{}");
        const email = encodeURIComponent(userJSONValue.email);
        const token = localStorage.getItem("token");
        const clientDetails = await api.get(`/client/email`, {
          params: { email: userJSONValue.email },
          headers: { Authorization: `Bearer ${token}` },
        });
        const nuttData = await api.get(`/nuts/id`, {
          params: { id: clientDetails.data[0].nId },
          headers: { Authorization: `Bearer ${token}` },
        });
        setNutData({
          id: nuttData.data[0].id,
          name: nuttData.data[0].name,
          email: nuttData.data[0].email,
        });
        setClientData((data) => ({
          ...data,
          id: clientDetails.data[0].id,
          name: clientDetails.data[0].name,
          email: clientDetails.data[0].email,
        }));
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };
    if (user) fetchData();
  }, [user]);

  const navigate = useNavigate();

  return (
    <DashboardLayout title="Client Dashboard" userRole="client">
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h2 className="text-2xl font-bold mb-2">Welcome back, {clientData.name}!</h2>
                <p className="text-gray-600">
                  Your {clientData.plan} plan is making great progress. Keep it up!
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <ContactNutritionistDialog nutritionistEmail={nutData.email} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats and Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-primary-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Next Appointment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-xl font-bold">{clientData.nextAppointment.date}</div>
                  <div className="text-gray-500 text-sm">{clientData.nextAppointment.time}</div>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-primary-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-primary-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Current Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-xl font-bold">{clientData.plan}</div>
                  <div className="text-gray-500 text-sm">Started {clientData.startDate}</div>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <ClipboardList className="h-6 w-6 text-primary-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-primary-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-xl font-bold">-5 lbs</div>
                  <div className="text-gray-500 text-sm">Last 4 weeks</div>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-primary-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Nutritionist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-xl font-bold">{nutData.name}</div>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-primary-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Progress Card */}
          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
              <CardDescription>Weight tracking over the past 4 weeks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end space-x-2">
                {clientData.progress.map((progress, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center h-64">
                      <div
                        className="bg-green-500 w-full border rounded-t-md"
                        style={{
                          height: progress.weight
                            ? `${Math.max(((progress.weight - 170) / 15) * 100, 10)}%`
                            : "10%",
                          minHeight: "20px",
                        }}
                      />

                    <div className="mt-2 text-xs font-medium">{progress.week}</div>
                    <div className="text-sm">{progress.weight} lbs</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Meal Plan Card */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Meal Plan</CardTitle>
              <CardDescription>Recommended by {nutData.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clientData.mealPlan.map((meal, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mt-1 mr-3">
                      <span className="text-primary-500 text-sm font-bold">{meal.meal[0]}</span>
                    </div>
                    <div>
                      <h4 className="font-medium">{meal.meal}</h4>
                      <p className="text-gray-600">{meal.food}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Nutritionist Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Your Nutritionist</CardTitle>
          </CardHeader>
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
                <div className="md:space-x-4 max-md:space-y-5 max-md:flex flex-col">
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
