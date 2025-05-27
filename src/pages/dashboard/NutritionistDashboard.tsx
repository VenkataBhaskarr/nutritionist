// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import DashboardLayout from "@/components/DashboardLayout";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Users, ClipboardCheck, Calendar, Plus } from "lucide-react";
// import { toast } from "sonner";
// import api from "@/lib/api";
// import {
//   Dialog,
//   DialogTrigger,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// // const MOCK_CLIENTS = [
// //   { id: 1, name: "Michael Brown", email: "michael@example.com", plan: "Weight Loss", lastCheckIn: "2023-05-10", progress: "Good" },
// //   { id: 2, name: "Jennifer Wilson", email: "jennifer@example.com", plan: "Muscle Gain", lastCheckIn: "2023-05-14", progress: "Excellent" },
// //   { id: 3, name: "David Thompson", email: "david@example.com", plan: "Sports Performance", lastCheckIn: "2023-05-12", progress: "Fair" },
// //   { id: 4, name: "Lisa Martinez", email: "lisa@example.com", plan: "General Health", lastCheckIn: "2023-05-15", progress: "Good" }
// // ];

// // const MOCK_APPOINTMENTS = [
// //   { id: 1, clientName: "Michael Brown", date: "2023-05-20", time: "10:00 AM", type: "Follow-up" },
// //   { id: 2, clientName: "Jennifer Wilson", date: "2023-05-21", time: "2:30 PM", type: "Initial Consultation" },
// //   { id: 3, clientName: "Lisa Martinez", date: "2023-05-22", time: "11:15 AM", type: "Progress Review" }
// // ];

// const NutritionistDashboard = () => {
//   const navigate = useNavigate();
//   const [clients, setClients] = useState([]);
//   const [appointments, setAppointments] = useState([]);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     age: "",
//     email: "",
//     phone: "",
//     gender: "",
//     location: "",
//     nextSession: "",
//     issue: "",
//   });

//   const user = JSON.parse(localStorage.getItem("user") || "{}");
//   const token = localStorage.getItem("token");
//   if(!token){
//     navigate("/login")
//   }

//   useEffect(() => {
//     const fetchDetails = async () => {
//       try {
//         const nutDetails = await api.get(`/nuts/email`, {
//           params: { email: user.email },
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const appoints = await api.get('/nuts/appointments',{
//           params: { id: nutDetails.data[0].id },
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setAppointments(appoints.data)

//         const clientDetails = await api.get(`/client/byNutId`, {
//           params: { id: nutDetails.data[0].id },
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setClients(clientDetails.data);
//       } catch (error) {
//         console.error("Failed to fetch clients", error);
//       }
//     };
//     fetchDetails();
//   }, []);

//   const handleAddClient = async () => {
//     const { name, age, email, phone, gender, location, issue } = formData;
//     console.log(formData)
//     if (!name || !age || !email || !phone || !gender || !location || !issue) {
//       toast.error("Please fill in all the fields.");
//       return;
//     }

//     try {
//       const nutDetails = await api.get(`/nuts/email`, {
//         params: { email: user.email },
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const newClient = {
//         ...formData,
//         nId: nutDetails.data[0].id,
//       };


//       await api.post(`/client/add`, newClient, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setClients((prev) => [...prev, newClient]);
//       setFormData({
//               name: "",
//               age: "",
//               email: "",
//               phone: "",
//               gender: "",
//               location: "",
//               issue: "",
//               nextSession: "",
//             });
     
//       toast.success("Client added successfully!");
//       setDialogOpen(false);
      

//       // Optionally refetch clients
//       const updatedClients = await api.get(`/client/byNutId`, {
//         params: { id: nutDetails.data[0].id },
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setClients(updatedClients.data);
//     } catch (error) {
//       toast.error("Failed to add client.");
//     }
//   };

//   return (
//     <DashboardLayout title="Nutritionist Dashboard" userRole="nutritionist">
//       {/* Toast setup */}
//       <div>
//         <div className="space-y-6">
//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//   {/* Total Clients */}
//             <Card className="shadow-sm hover:shadow-md transition-shadow border border-gray-100">
//               <CardHeader className="pb-4 flex flex-row items-center justify-between space-y-0">
//                 <div>
//                   <CardTitle className="text-xs uppercase tracking-wide text-muted-foreground">
//                     Total Clients
//                   </CardTitle>
//                   <div className="text-2xl font-semibold text-gray-800 mt-1">{clients.length}</div>
//                 </div>
//                 <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
//                   <Users className="w-5 h-5 text-primary-500" />
//                 </div>
//               </CardHeader>
//             </Card>

//             {/* Appointments */}
//             <Card className="shadow-sm hover:shadow-md transition-shadow border border-gray-100">
//               <CardHeader className="pb-4 flex flex-row items-center justify-between space-y-0">
//                 <div>
//                   <CardTitle className="text-xs uppercase tracking-wide text-muted-foreground">
//                     Upcoming Appointments
//                   </CardTitle>
//                   <div className="text-2xl font-semibold text-gray-800 mt-1">{clients.length}</div>
//                 </div>
//                 <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
//                   <Calendar className="w-5 h-5 text-primary-500" />
//                 </div>
//               </CardHeader>
//             </Card>

//             {/* Plans Created */}
//             <Card className="shadow-sm hover:shadow-md transition-shadow border border-gray-100">
//               <CardHeader className="pb-4 flex flex-row items-center justify-between space-y-0">
//                 <div>
//                   <CardTitle className="text-xs uppercase tracking-wide text-muted-foreground">
//                     Plans Created
//                   </CardTitle>
//                   <div className="text-2xl font-semibold text-gray-800 mt-1">{clients.length}</div>
//                 </div>
//                 <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
//                   <ClipboardCheck className="w-5 h-5 text-primary-500" />
//                 </div>
//               </CardHeader>
//             </Card>
//           </div>


//           {/* Clients Table */}
//           <Card className="shadow-sm border border-gray-100">
//   <CardHeader className="flex flex-row items-center justify-between pb-3">
//     <CardTitle className="text-lg font-semibold text-gray-800">Clients</CardTitle>
//     <Button
//       size="sm"
//       onClick={() => setDialogOpen(true)}
//       className="bg-primary-500 hover:bg-primary-600 text-white flex items-center gap-1"
//     >
//       <Plus className="w-4 h-4" />
//       Add Client
//     </Button>
//   </CardHeader>

//   <CardContent>
//     <div className="overflow-x-auto">
//       <table className="min-w-full text-sm text-gray-700">
//         <thead className="text-xs font-semibold uppercase bg-gray-50 text-gray-500">
//           <tr>
//             <th className="px-4 py-3 text-left">Name</th>
//             <th className="px-4 py-3 text-left">Email</th>
//             <th className="px-4 py-3 text-left">Plan</th>
//             <th className="px-4 py-3 text-left">Next Session</th>
//             <th className="px-4 py-3 text-left">Progress</th>
//             <th className="px-4 py-3 text-left">Actions</th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-gray-100">
//           {clients.map((client) => (
//             <tr key={client.id} className="hover:bg-gray-50 transition-colors">
//               <td className="px-4 py-3 whitespace-nowrap">{client.name}</td>
//               <td className="px-4 py-3 whitespace-nowrap">{client.email}</td>
//               <td className="px-4 py-3 whitespace-nowrap">{client.plan}</td>
//               <td className="px-4 py-3 whitespace-nowrap">{client.nextSession}</td>
//               <td className="px-4 py-3">
//                 <span
//                   className={`px-2 py-1 rounded-full text-xs font-medium ${
//                     client.progress === "Excellent"
//                       ? "bg-green-100 text-green-700"
//                       : client.progress === "Good"
//                       ? "bg-blue-100 text-blue-700"
//                       : "bg-yellow-100 text-yellow-700"
//                   }`}
//                 >
//                   {client.progress}
//                 </span>
//               </td>
//               <td className="px-4 py-3">
//                 <div className="flex items-center gap-2">
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className="text-primary-600 hover:text-primary-700"
//                   >
//                     Message
//                   </Button>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   </CardContent>
// </Card>


//           {/* Add Client Dialog */}
//           <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//             <DialogContent>
//               <DialogHeader>
//                 <DialogTitle>Add New Client</DialogTitle>
//               </DialogHeader>
//              <div className="space-y-4">
//                 {["name", "age", "email", "phone", "gender", "location", "issue", "nextSession"].map((field) => (
//                   <div key={field} className="space-y-2">
//                     <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
//                     <Input
//                       id={field}
//                       type={
//                         field === "age"
//                           ? "number"
//                           : field === "nextSession"
//                           ? "date"
//                           : "text"
//                       }
//                       value={(formData as any)[field]}
//                       onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
//                     />
//                   </div>
//                 ))}
//               </div>

//               <DialogFooter>
//                 <Button onClick={handleAddClient}>Submit</Button>
//               </DialogFooter>
//             </DialogContent>
//           </Dialog>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default NutritionistDashboard;

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ClipboardCheck, Calendar, Plus } from "lucide-react";
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
  const [appointments, setAppointments] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [messageDialog, setMessageDialog] = useState({ open: false, client: null });
  const [messageText, setMessageText] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    phone: "",
    gender: "",
    location: "",
    nextSession: "",
    issue: "",
  });

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

        const appoints = await api.get("/nuts/appointments", {
          params: { id: nutDetails.data[0].id },
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(appoints.data);

        const clientDetails = await api.get(`/client/byNutId`, {
          params: { id: nutDetails.data[0].id },
          headers: { Authorization: `Bearer ${token}` },
        });

        setClients(clientDetails.data);
      } catch (error) {
        console.error("Failed to fetch clients", error);
      }
    };
    fetchDetails();
  }, []);

  const handleAddClient = async () => {
    const { name, age, email, phone, gender, location, issue } = formData;
    if (!name || !age || !email || !phone || !gender || !location || !issue) {
      toast.error("Please fill in all the fields.");
      return;
    }

    try {
      const nutDetails = await api.get(`/nuts/email`, {
        params: { email: user.email },
        headers: { Authorization: `Bearer ${token}` },
      });

      const newClient = {
        ...formData,
        nId: nutDetails.data[0].id,
      };

      await api.post(`/client/add`, newClient, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setClients((prev) => [...prev, newClient]);
      setFormData({
        name: "",
        age: "",
        email: "",
        phone: "",
        gender: "",
        location: "",
        issue: "",
        nextSession: "",
      });

      toast.success("Client added successfully!");
      setDialogOpen(false);

      const updatedClients = await api.get(`/client/byNutId`, {
        params: { id: nutDetails.data[0].id },
        headers: { Authorization: `Bearer ${token}` },
      });
      setClients(updatedClients.data);
    } catch (error) {
      toast.error("Failed to add client.");
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
    <DashboardLayout title="Nutritionist Dashboard" userRole="nutritionist">
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
                  Plans Created
                </CardTitle>
                <div className="text-2xl font-semibold text-gray-800 mt-1">{clients.length}</div>
              </div>
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <ClipboardCheck className="w-5 h-5 text-primary-500" />
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Clients Table */}
        <Card className="shadow-sm border border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg font-semibold text-gray-800">Clients</CardTitle>
            <Button
              size="sm"
              onClick={() => setDialogOpen(true)}
              className="bg-primary-500 hover:bg-primary-600 text-white flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add Client
            </Button>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-gray-700">
                <thead className="text-xs font-semibold uppercase bg-gray-50 text-gray-500">
                  <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Plan</th>
                    <th className="px-4 py-3 text-left">Next Session</th>
                    <th className="px-4 py-3 text-left">Progress</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {clients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">{client.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{client.email}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{client.plan}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{client.nextSession}</td>
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
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Add Client Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {["name", "age", "email", "phone", "gender", "location", "issue", "nextSession"].map((field) => (
                <div key={field} className="space-y-2">
                  <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                  <Input
                    id={field}
                    type={field === "age" ? "number" : field === "nextSession" ? "date" : "text"}
                    value={(formData as any)[field]}
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                  />
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button onClick={handleAddClient}>Submit</Button>
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
