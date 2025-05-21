import axios from "axios"
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ClipboardCheck, Calendar } from "lucide-react";
import api from "@/lib/api";
// Mock data for the demo
const MOCK_CLIENTS = [
  { id: 1, name: "Michael Brown", email: "michael@example.com", plan: "Weight Loss", lastCheckIn: "2023-05-10", progress: "Good" },
  { id: 2, name: "Jennifer Wilson", email: "jennifer@example.com", plan: "Muscle Gain", lastCheckIn: "2023-05-14", progress: "Excellent" },
  { id: 3, name: "David Thompson", email: "david@example.com", plan: "Sports Performance", lastCheckIn: "2023-05-12", progress: "Fair" },
  { id: 4, name: "Lisa Martinez", email: "lisa@example.com", plan: "General Health", lastCheckIn: "2023-05-15", progress: "Good" }
];

const MOCK_APPOINTMENTS = [
  { id: 1, clientName: "Michael Brown", date: "2023-05-20", time: "10:00 AM", type: "Follow-up" },
  { id: 2, clientName: "Jennifer Wilson", date: "2023-05-21", time: "2:30 PM", type: "Initial Consultation" },
  { id: 3, clientName: "Lisa Martinez", date: "2023-05-22", time: "11:15 AM", type: "Progress Review" }
];

const NutritionistDashboard = () => {
  const user = localStorage.getItem("user")
  const userJSON = JSON.parse(user)
  const [clients, setClients] = useState(MOCK_CLIENTS);
  useEffect(() => {
     const fetchDetails = async() => {
       const userJSONValue = JSON.parse(user)
      //  const email = encodeURIComponent(userJSONValue.email);
       const token = localStorage.getItem("token")
       const nutDetails = await api.get(`/nuts/email`, {
        params: { email: userJSONValue.email },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // console.log(nutDetails)
      const clientDetails = await api.get(`/client/byNutId`, {
        params: { id: nutDetails.data[0].id },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(clientDetails)
      setClients(clientDetails.data)
      // console.log(clients)
     }
     fetchDetails()
  })
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);
  const navigate = useNavigate();

  return (
    <DashboardLayout title="Nutritionist Dashboard" userRole="nutritionist">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-primary-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold">{clients.length}</div>
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-primary-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold">{appointments.length}</div>
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-primary-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-primary-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Plans Created</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold">{clients.length}</div>
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <ClipboardCheck className="h-6 w-6 text-primary-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Clients Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>My Clients</CardTitle>
              <Button size="sm" className="bg-primary-500 hover:bg-primary-600">
                Add Client
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-2 text-left font-medium text-gray-500">Name</th>
                    <th className="py-3 px-2 text-left font-medium text-gray-500">Email</th>
                    <th className="py-3 px-2 text-left font-medium text-gray-500">Plan</th>
                    <th className="py-3 px-2 text-left font-medium text-gray-500">Last Check-in</th>
                    <th className="py-3 px-2 text-left font-medium text-gray-500">Progress</th>
                    <th className="py-3 px-2 text-left font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2">{client.name}</td>
                      <td className="py-3 px-2">{client.email}</td>
                      <td className="py-3 px-2">{client.plan}</td>
                      <td className="py-3 px-2">{client.lastCheckIn}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          client.progress === "Excellent" ? "bg-green-100 text-green-800" :
                          client.progress === "Good" ? "bg-blue-100 text-blue-800" :
                          "bg-yellow-100 text-yellow-800"
                        }`}>
                          {client.progress}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">View</Button>
                          <Button variant="ghost" size="sm">Message</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Upcoming Appointments</CardTitle>
              <Button size="sm" className="bg-primary-500 hover:bg-primary-600">
                Schedule New
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-2 text-left font-medium text-gray-500">Client</th>
                    <th className="py-3 px-2 text-left font-medium text-gray-500">Date</th>
                    <th className="py-3 px-2 text-left font-medium text-gray-500">Time</th>
                    <th className="py-3 px-2 text-left font-medium text-gray-500">Type</th>
                    <th className="py-3 px-2 text-left font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2">{appointment.clientName}</td>
                      <td className="py-3 px-2">{appointment.date}</td>
                      <td className="py-3 px-2">{appointment.time}</td>
                      <td className="py-3 px-2">{appointment.type}</td>
                      <td className="py-3 px-2">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">Reschedule</Button>
                          <Button variant="ghost" size="sm">Cancel</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default NutritionistDashboard;
