import confetti from 'canvas-confetti';
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ClipboardCheck, Calendar, Plus } from "lucide-react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const NutritionistDashboard = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [clientId, setClientId] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
  const [messageDialog, setMessageDialog] = useState({ open: false, client: null });
  const [messageText, setMessageText] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [showCompletedContent, setShowCompletedContent] = useState(true);
  const [notesDialog, setNotesDialog] = useState({ open: false, client: null });
  const [meetingNotes, setMeetingNotes] = useState("");
  
  // Add loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Move token and user checks inside useEffect
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    
    // Early return if no auth data
    if (!token || !userStr) {
      navigate("/login");
      return;
    }

    let user;
    try {
      user = JSON.parse(userStr);
    } catch (e) {
      console.error("Failed to parse user data:", e);
      navigate("/login");
      return;
    }

    if (!user?.email) {
      navigate("/login");
      return;
    }

    const fetchDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch nutritionist details
        const nutDetails = await api.get(`/nuts/email`, {
          params: { email: user.email },
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!nutDetails.data?.[0]?.id) {
          throw new Error("Nutritionist data not found");
        }

        const nutritionistId = nutDetails.data[0].id;

        // Fetch completed appointments
        const appoints = await api.get("/nuts/appointmentsCompleted", {
          params: { id: nutritionistId },
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch client details for completed appointments
        const appointmentsWithClients = await Promise.all(
          (appoints.data || []).map(async (appointment) => {
            try {
              const clientRes = await api.get("/client/clientById", {
                params: { id: appointment.clientId },
                headers: { Authorization: `Bearer ${token}` },
              });
              return {
                ...appointment,
                client: clientRes.data,
              };
            } catch (err) {
              console.error(`Error fetching client ${appointment.clientId}`, err);
              return appointment;
            }
          })
        );

        setCompletedAppointments(appointmentsWithClients);

        // Fetch client details
        const clientDetails = await api.get(`/client/byNutId`, {
          params: { id: nutritionistId },
          headers: { Authorization: `Bearer ${token}` },
        });

        const clients = clientDetails.data || [];

        // Fetch all client goals in parallel
        const clientsWithGoals = await Promise.all(
          clients.map(async (client) => {
            try {
              const goalRes = await api.get(`/client/goal`, {
                params: { clientId: client.id },
                headers: { Authorization: `Bearer ${token}` },
              });

              const progress = goalRes.data?.[0]?.progress ?? 0;
              return { ...client, progress };
            } catch (error) {
              console.error(`Failed to fetch goals for client ${client.id}`, error);
              return { ...client, progress: 0 };
            }
          })
        );

        // Sort based on session date
        const sortedClients = clientsWithGoals.sort(
          (a, b) =>
            new Date(a.nextSession).getTime() - new Date(b.nextSession).getTime()
        );

        // Filter appointments within 7 days
        const normalizeDate = (dateStr) => {
          const d = new Date(dateStr);
          d.setHours(0, 0, 0, 0);
          return d;
        };

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const oneWeekFromNow = new Date(today);
        oneWeekFromNow.setDate(today.getDate() + 7);

        const appointmentsThisWeek = sortedClients.filter((client) => {
          const sessionDate = normalizeDate(client.nextSession);
          return sessionDate >= today && sessionDate <= oneWeekFromNow;
        });

        setAppointments(appointmentsThisWeek);
        setClients(sortedClients);

      } catch (error) {
        console.error("Failed to fetch details:", error);
        setError(error.message || "Failed to fetch data");
        
        // If it's an auth error, redirect to login
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [navigate]); // Add navigate as dependency

  // Add loading state
  if (isLoading) {
    return (
      <DashboardLayout title="Appointments" userRole="nutritionist">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Add error state
  if (error) {
    return (
      <DashboardLayout title="Appointments" userRole="nutritionist">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-red-500 mb-4">⚠️</div>
            <p className="text-gray-600 mb-4">Error loading dashboard: {error}</p>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Handle message sending with better error handling
  const sendMessage = async (client) => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    
    if (!token || !userStr) {
      navigate("/login");
      return;
    }

    let user;
    try {
      user = JSON.parse(userStr);
    } catch (e) {
      toast.error("Authentication error");
      navigate("/login");
      return;
    }

    if (!messageText.trim()) {
      toast.error("Please enter a message");
      return;
    }

    try {
      const nutDetails = await api.get(`/nuts/email`, {
        params: { email: user.email },
        headers: { Authorization: `Bearer ${token}` },
      });

      const newMessage = {
        nId: nutDetails.data[0].id,
        cId: messageDialog.client.id,
        content: messageText.trim(),
        sentAt: new Date().toISOString(),
      };

      await api.post(`/nuts/sendMessage`, newMessage, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessageText('');
      toast.success(`Message sent to ${messageDialog.client.name}`);
      setMessageDialog({ open: false, client: null });
    } catch (err) {
      console.error("Failed to send message:", err);
      toast.error(`Unable to send message to ${messageDialog.client.name}`);
    }
  };

  const handleActionComplete = async () => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    
    if (!token || !userStr) {
      navigate("/login");
      return;
    }

    let user;
    try {
      user = JSON.parse(userStr);
    } catch (e) {
      toast.error("Authentication error");
      navigate("/login");
      return;
    }

    try {
      const nutDetails = await api.get(`/nuts/email`, {
        params: { email: user.email },
        headers: { Authorization: `Bearer ${token}` },
      });

      const client = notesDialog.client;
      const { id, nextSession } = client;

      const payload = {
        clientId: id,
        scheduledAt: nextSession,
        notes: meetingNotes,
        nutritionistId: nutDetails.data[0].id,
      };

      const clientUpdatePayload = {
        id: id,
        nextSession: "2025-07-30",
        prevSession: nextSession,
      };

      await api.post("/appointments/complete", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await api.post("client/updateDetails", clientUpdatePayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAppointments((prev) => prev.filter((appt) => appt.id !== client.id));
      setClients((prevClients) =>
        prevClients.map((c) =>
          c.id === client.id ? { ...c, completed: true } : c
        )
      );

      setNotesDialog({ open: false, client: null });
      setMeetingNotes("");
      toast.success("Appointment marked as completed 🎯");

    } catch (error) {
      console.error("Error completing appointment", error);
      toast.error("Could not complete appointment ❌");
    }
  };

  const handleCompleteAppointment = (client) => {
    showConffeti();
    setNotesDialog({ open: true, client });
  };

  const showConffeti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#34d399', '#10b981', '#6ee7b7'],
    });

    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 100,
        origin: { y: 0.4 },
        scalar: 0.8,
        colors: ['#34d399', '#a7f3d0'],
      });
    }, 300);
  };

  const handleAddAppointment = async () => {
    if (!clientId) {
      toast.error("Client ID is required");
      return;
    }

    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    
    if (!token || !userStr) {
      navigate("/login");
      return;
    }

    let user;
    try {
      user = JSON.parse(userStr);
    } catch (e) {
      toast.error("Authentication error");
      return;
    }

    try {
      const nutDetails = await api.get(`/nuts/email`, {
        params: { email: user.email },
        headers: { Authorization: `Bearer ${token}` },
      });

      await api.post(`/client/updateSession`, {
        cId: clientId,
        appointmentDate,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await api.post(`/appointments/add`, {
        appointmentDate,
        nId: nutDetails.data[0].id,
        cId: clientId,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Appointment added successfully");
      setAppointmentDialogOpen(false);
      setClientId("");

      const updatedClients = await api.get(`/client/byNutId`, {
        params: { id: nutDetails.data[0].id },
        headers: { Authorization: `Bearer ${token}` },
      });
      setClients(updatedClients.data);
    } catch (error) {
      console.error("Failed to add appointment:", error);
      toast.error("Failed to add appointment");
    }
  };

  return (
    <DashboardLayout title="Appointments" userRole="nutritionist">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Clients */}
          <Card className="shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <CardHeader className="pb-4 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-xs uppercase tracking-wide text-muted-foreground">
                  Total Clients
                </CardTitle>
                <div className="text-2xl font-semibold text-gray-800 mt-1">{clients.length}</div>
              </div>
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-primary-500" />
              </div>
            </CardHeader>
          </Card>

          {/* Appointments */}
          <Card className="shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <CardHeader className="pb-4 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-xs uppercase tracking-wide text-muted-foreground">
                  Appointments In the Week
                </CardTitle>
                <div className="text-2xl font-semibold text-gray-800 mt-1">{appointments.length}</div>
              </div>
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary-500" />
              </div>
            </CardHeader>
          </Card>

          {/* Plans Created */}
          <Card className="shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <CardHeader className="pb-4 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-xs uppercase tracking-wide text-muted-foreground">
                  Completed Appointments
                </CardTitle>
                <div className="text-2xl font-semibold text-gray-800 mt-1">{completedAppointments.length}</div>
              </div>
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <ClipboardCheck className="w-5 h-5 text-primary-500" />
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Top Buttons */}
        <div className="flex justify-end mb-4">
          <Button onClick={() => setAppointmentDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" /> Add Appointment
          </Button>
        </div>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">My Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-gray-700">
                <thead className="text-xs font-semibold uppercase bg-gray-50 text-gray-500">
                  <tr>
                    <th className="px-4 py-3 text-left">Id</th>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Plan</th>
                    <th className="px-4 py-3 text-left">Next Appointment</th>
                    <th className="px-4 py-3 text-left">Progress</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {clients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">{client.id}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{client.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{client.email}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{client.plan}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span>{client.nextSession}</span>
                          {(() => {
                            const today = new Date();
                            const sessionDate = new Date(client.nextSession);
                            const diffInMs = sessionDate.getTime() - today.getTime();
                            const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
                            
                            const isToday = sessionDate.toDateString() === today.toDateString();
                            const isThisWeek =
                              sessionDate > today &&
                              sessionDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                            
                            if(client.completed){
                              return (
                                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-500 text-white">
                                  Completed
                                </span>
                              )
                            }
                            if (isToday) {
                              return (
                                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-500 text-white">
                                  Today
                                </span>
                              );
                            }

                            if (isThisWeek) {
                              return (
                                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-orange-100 text-orange-700">
                                  This Week
                                </span>
                              );
                            }

                            if (diffInDays > 7) {
                              return (
                                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">
                                  Upcoming
                                </span>
                              );
                            }

                            if (diffInDays < 0) {
                              return (
                                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-200 text-gray-500">
                                  Past
                                </span>
                              );
                            }

                            return null;
                          })()}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            client.progress === "Excellent"
                              ? "bg-green-100 text-green-700"
                              : client.progress === "Good"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {client.progress}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary-600 hover:text-primary-700"
                            onClick={() => setMessageDialog({ open: true, client })}
                          >
                            Message
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={client.completed}
                            className={`text-primary-600 hover:text-primary-700 ${client.completed ? "opacity-50 cursor-not-allowed" : ""}`}
                            onClick={() => handleCompleteAppointment(client)}
                          >
                            {client.completed ? "Completed" : "Complete"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary-600 hover:text-primary-700"
                            onClick={() => window.open('https://meet.google.com/landing', '_blank')}
                          >
                            Schedule
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Completed Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between cursor-pointer"
            onClick={() => setShowCompletedContent(!showCompletedContent)}
          >
            <CardTitle className="text-lg font-semibold">Completed Appointments</CardTitle>
            {showCompletedContent ? (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-500" />
            )}
          </CardHeader>

          {showCompletedContent && (
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-gray-700">
                  <thead className="text-xs font-semibold uppercase bg-gray-50 text-gray-500">
                    <tr>
                      <th className="px-4 py-3 text-left">Id</th>
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Email</th>
                      <th className="px-4 py-3 text-left">Plan</th>
                      <th className="px-4 py-3 text-left">Notes</th>
                      <th className="px-4 py-3 text-left">Appointment Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {completedAppointments.map((appointment) => (
                      <tr
                        key={appointment.id}
                        className="hover:bg-gray-100 bg-white border-b transition-colors text-gray-500 line-through"
                      >
                        <td className="px-4 py-3 whitespace-nowrap">{appointment.client[0]?.id}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{appointment.client[0]?.name}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{appointment.client[0]?.email}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{appointment.client[0]?.plan}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{appointment.notes}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span>{appointment.client[0]?.lastSession}</span>
                            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-500 text-white">
                              Completed
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Add Appointment Dialog */}
        <Dialog open={appointmentDialogOpen} onOpenChange={setAppointmentDialogOpen}>
          <DialogContent className="max-w-md w-full">
            <DialogHeader>
              <DialogTitle>Add New Appointment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Enter Client ID"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
              />
              <Input
                type="date"
                placeholder="Select Date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
              />
            </div>
            <DialogFooter className="mt-4">
              <Button onClick={handleAddAppointment}>Add Appointment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Notes Dialog */}
        <Dialog open={notesDialog.open} onOpenChange={(open) => !open && setNotesDialog({ open: false, client: null })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Meeting Notes</DialogTitle>
              <DialogDescription>
                Add a short summary of your session with <strong>{notesDialog.client?.name}</strong>.
              </DialogDescription>
            </DialogHeader>

            <Textarea
              value={meetingNotes}
              onChange={(e) => setMeetingNotes(e.target.value)}
              placeholder="e.g. Discussed diet, revised meal plan, advised workout change..."
              className="mt-2"
            />

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="ghost" onClick={() => setNotesDialog({ open: false, client: null })}>
                Cancel
              </Button>
              <Button onClick={handleActionComplete} disabled={!meetingNotes.trim()}>
                Submit Notes
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Message Dialog */}
        <Dialog open={messageDialog.open} onOpenChange={(open) => setMessageDialog({ open, client: messageDialog.client })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Message {messageDialog.client?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Label htmlFor="message">Your Message</Label>
              <Textarea
                id="message"
                rows={4}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your message..."
              />
            </div>
            <DialogFooter>
              <Button onClick={sendMessage}>Send</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default NutritionistDashboard;