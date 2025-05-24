import React, { FC, useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DashboardLayout from '@/components/DashboardLayout';
import api from "@/lib/api";

interface NutritionistInfo {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  specialization: string;
  experience: string;
  rating: number;
}

interface Session {
  id: number;
  date: string;
  time: string;
  type: string;
  duration: string;
  status: 'completed' | 'upcoming' | 'cancelled';
}

const BookSessionDialog: FC<{
  clientId: number;
  nutritionistId: number;
  onSuccess?: () => void;
}> = ({ clientId, nutritionistId, onSuccess }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("");
  const [duration, setDuration] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time || !type || !duration) {
      setError("All fields are required.");
      return;
    }
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      await api.post(
        "/appointments",
        { clientId, nutritionistId, date, time, type, duration, status: "upcoming" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setError("");
      setDate("");
      setTime("");
      setType("");
      setDuration("");
      onSuccess?.();
      alert("Session booked successfully!");
    } catch (err) {
      setError("Failed to book session. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-primary-500 hover:bg-primary-600">Book New Session</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book New Session</DialogTitle>
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
          <div>
            <Label htmlFor="type">Session Type</Label>
            <Input
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="duration">Duration (e.g., 30 minutes)</Label>
            <Input
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" disabled={isSubmitting} className="w-full bg-primary-500 hover:bg-primary-600">
            {isSubmitting ? "Booking..." : "Book Session"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const RescheduleSessionDialog: FC<{
  sessionId: number;
  onSuccess?: () => void;
}> = ({ sessionId, onSuccess }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) {
      setError("Date and time are required.");
      return;
    }
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      await api.put(
        `/appointments/${sessionId}`,
        { date, time },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setError("");
      setDate("");
      setTime("");
      onSuccess?.();
      alert("Session rescheduled successfully!");
    } catch (err) {
      setError("Failed to reschedule session. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-primary-500 text-primary-500 hover:bg-primary-50">
          Reschedule
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reschedule Session</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="date">New Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="time">New Time</Label>
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
            {isSubmitting ? "Rescheduling..." : "Reschedule"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const CancelSessionDialog: FC<{
  sessionId: number;
  onSuccess?: () => void;
}> = ({ sessionId, onSuccess }) => {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      await api.put(
        `/appointments/${sessionId}`,
        { status: "cancelled" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setError("");
      onSuccess?.();
      alert("Session cancelled successfully!");
    } catch (err) {
      setError("Failed to cancel session. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-red-500 border-red-500 hover:bg-red-50">
          Cancel
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel Session</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <p>Are you sure you want to cancel this session?</p>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" disabled={isSubmitting} className="w-full bg-red-500 hover:bg-red-600">
            {isSubmitting ? "Cancelling..." : "Confirm Cancel"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const SendMessageDialog: FC<{
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
        { message, contactMethod: "email", recipient: nutritionistEmail },
        { headers: { Authorization: `Bearer ${token}` } }
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
        <Button variant="outline" className="w-full border-primary-500 text-primary-500 hover:bg-primary-50">
          Send Message
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Message</DialogTitle>
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

const ClientNut: FC = () => {
  const [nutritionist, setNutritionist] = useState<NutritionistInfo>({
    id: 0,
    name: "",
    email: "",
    phone: "",
    address: "",
    specialization: "",
    experience: "",
    rating: 0,
  });
  const [sessions, setSessions] = useState<Session[]>([]);
  const [nextSession, setNextSession] = useState<string>("");
  const [clientId, setClientId] = useState<number>(0);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const email = encodeURIComponent(user.email);

        // Fetch client info to get nId and clientId
        const clientResponse = await api.get(`/client/email`, {
          params: { email },
          headers: { Authorization: `Bearer ${token}` },
        });
        const clientData = clientResponse.data[0];
        setClientId(clientData.id);

        // Fetch nutritionist info
        const nutResponse = await api.get(`/nuts/id`, {
          params: { id: clientData.nId },
          headers: { Authorization: `Bearer ${token}` },
        });
        setNutritionist({
          id: nutResponse.data[0].id,
          name: nutResponse.data[0].name,
          email: nutResponse.data[0].email,
          phone: nutResponse.data[0].phone,
          address: nutResponse.data[0].location || "Not provided",
          specialization: nutResponse.data[0].qualification,
          experience: nutResponse.data[0].experience || "Not provided",
          rating: parseFloat(nutResponse.data[0].rating) || 0,
        });

        // Fetch sessions
        const sessionsResponse = await api.get(`/appointments/client`, {
          params: { clientId: clientData.id },
          headers: { Authorization: `Bearer ${token}` },
        });
        const sessionsData = Array.isArray(sessionsResponse.data) ? sessionsResponse.data : [];
        setSessions(sessionsData);

        // Find next upcoming session
        const upcomingSession = sessionsData.find((s: Session) => s.status === "upcoming");
        setNextSession(upcomingSession ? `${upcomingSession.date} ${upcomingSession.time}` : "No upcoming sessions");
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout title="My Nutritionist" userRole="client">
        <div className="p-4">Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="My Nutritionist" userRole="client">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">My Nutritionist</h1>
          <BookSessionDialog clientId={clientId} nutritionistId={nutritionist.id} onSuccess={() => window.location.reload()} />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Nutritionist Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                    <span className="text-4xl text-primary-500">
                      {nutritionist.name ? nutritionist.name.slice(0, 2).toUpperCase() : "SS"}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold">{nutritionist.name}</h2>
                  <p className="text-gray-500">{nutritionist.specialization}</p>
                  <div className="flex items-center mt-2">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i < Math.round(nutritionist.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-2 text-gray-600">{nutritionist.rating.toFixed(1)}/5.0</span>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <p className="text-sm"><strong>Experience:</strong> {nutritionist.experience}</p>
                  <p className="text-sm"><strong>Email:</strong> {nutritionist.email}</p>
                  <p className="text-sm"><strong>Phone:</strong> {nutritionist.phone}</p>
                  <p className="text-sm"><strong>Address:</strong> {nutritionist.address}</p>
                  <SendMessageDialog nutritionistEmail={nutritionist.email} onSuccess={() => window.location.reload()} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Next Session</CardTitle>
              </CardHeader>
              <CardContent>
                {nextSession !== "No upcoming sessions" ? (
                  <div className="bg-primary-50 p-4 rounded-lg">
                    <p className="text-lg font-semibold">{nextSession}</p>
                    <p className="text-gray-600">{sessions.find((s) => s.status === "upcoming")?.type || "Session"}</p>
                    <div className="mt-4 space-x-2">
                      <RescheduleSessionDialog
                        sessionId={sessions.find((s) => s.status === "upcoming")?.id || 0}
                        onSuccess={() => window.location.reload()}
                      />
                      <CancelSessionDialog
                        sessionId={sessions.find((s) => s.status === "upcoming")?.id || 0}
                        onSuccess={() => window.location.reload()}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">No upcoming sessions scheduled.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Session History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sessions.length > 0 ? (
                    sessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-4 bg-primary-50 rounded-lg">
                        <div>
                          <p className="font-medium">{session.type}</p>
                          <p className="text-sm text-gray-500">{session.date} • {session.time} • {session.duration}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          session.status === 'completed' ? 'bg-green-100 text-green-800' :
                          session.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {session.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No session history available.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientNut;
