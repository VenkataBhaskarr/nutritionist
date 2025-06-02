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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const NutritionistDashboard = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [clientId, setClientId] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
  const [messageDialog, setMessageDialog] = useState({ open: false, client: null });
  const [messageText, setMessageText] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("")
  const [showCompletedContent, setShowCompletedContent] = useState(true);

  
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  if (!token) navigate("/login");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const nutDetails = await api.get(`/nuts/email`, {
          params: { email: user.email },
          headers: { Authorization: `Bearer ${token}` },
        });

        // const appoints = await api.get("/nuts/appointments", {
        //   params: { id: nutDetails.data[0].id },
        //   headers: { Authorization: `Bearer ${token}` },
        // });
        

       const clientDetails = await api.get(`/client/byNutId`, {
          params: { id: nutDetails.data[0].id },
          headers: { Authorization: `Bearer ${token}` },
        });

        // Sort by session date
        const sortedClients = clientDetails.data.sort(
          (a, b) => new Date(a.nextSession).getTime() - new Date(b.nextSession).getTime()
        );

        // Normalize dates to midnight (to compare by day, not time)
        const normalizeDate = (dateStr: string | Date) => {
          const d = new Date(dateStr);
          d.setHours(0, 0, 0, 0);
          return d;
        };

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const oneWeekFromNow = new Date(today);
        oneWeekFromNow.setDate(today.getDate() + 7);

        // Filter appointments within 7 days
        const appointmentsThisWeek = sortedClients.filter((client) => {
          const sessionDate = normalizeDate(client.nextSession);
          return sessionDate >= today && sessionDate <= oneWeekFromNow;
        });

        console.log("appointmentsThisWeek 👉", appointmentsThisWeek);

        setAppointments(appointmentsThisWeek);
        setClients(sortedClients);

        //setClients(clientDetails.data);
      } catch (error) {
        console.error("Failed to fetch clients", error);
      }
    };
    fetchDetails();
  }, []);
  const handleCompleteAppointment = (id: number) => {
  // Confetti + Toast
  showConffeti();
  toast.success("Appointment marked as completed");

  // Remove from appointments list
  setAppointments((prev) => prev.filter((appt) => appt.id !== id));

  // Optional: Update the client state if you want to reflect 'completed' on UI
  setClients((prevClients) =>
    prevClients.map((client) =>
      client.id === id ? { ...client, completed: true } : client
    )
  );
};

  const showConffeti = () => {
      confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#34d399', '#10b981', '#6ee7b7'], // green-themed 🎯
        });

        // Optional: small burst after delay for extra flair
        setTimeout(() => {
          confetti({
            particleCount: 50,
            spread: 100,
            origin: { y: 0.4 },
            scalar: 0.8,
            colors: ['#34d399', '#a7f3d0'],
          });
        }, 300);
  }

  
  const handleAddAppointment = async () => {
    if (!clientId) {
      toast.error("Client ID is required");
      return;
    }
    try {

      // update the nextSession Date of the client here
     
      const nutDetails = await api.get(`/nuts/email`, {
        params: { email: user.email },
        headers: { Authorization: `Bearer ${token}` },
      });

       const updateSessionDate = await api.post(`/client/updateSession`, {
        cId: clientId,
        appointmentDate,
      },
       {
        headers: { Authorization: `Bearer ${token}` },
      })

      

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
      toast.error("Failed to add appointment");
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    try {
      // await api.post(`/messages/send`, {
      //   to: messageDialog.client.email,
      //   message: messageText,
      // }, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });

      toast.success(`Message sent to ${messageDialog.client.name}`);
      setMessageDialog({ open: false, client: null });
      setMessageText("");
    } catch (err) {
      toast.error("Failed to send message.");
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
                  Upcoming Appointments
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
                <div className="text-2xl font-semibold text-gray-800 mt-1">{clients.length}</div>
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

        {/* Clients Table */}
        

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
                            onClick={() => handleCompleteAppointment(client.id)}
                          >
                            {client.completed ? "Completed" : "Complete"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary-600 hover:text-primary-700"
                            onClick={() => setMessageDialog({ open: true, client })}
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

        {/* Completed Appointments WIP */}
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
              <th className="px-4 py-3 text-left">Appointment Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {clients.map((client) => (
              <tr
                key={client.id}
                className="hover:bg-gray-100 bg-white border-b transition-colors text-gray-500 line-through"
              >
                <td className="px-4 py-3 whitespace-nowrap">{client.id}</td>
                <td className="px-4 py-3 whitespace-nowrap">{client.name}</td>
                <td className="px-4 py-3 whitespace-nowrap">{client.email}</td>
                <td className="px-4 py-3 whitespace-nowrap">{client.plan}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span>{client.nextSession}</span>
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
        

        {/* Add Appointment fresh Dialog */}
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
              <Button onClick={handleSendMessage}>Send</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </DashboardLayout>
  );
};

export default NutritionistDashboard;
