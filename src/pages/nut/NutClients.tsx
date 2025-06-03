import { FC, useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { Users, Activity, CalendarClock } from "lucide-react"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  PlusCircle,
  UserRound,
  Info,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

interface Client {
  id: string;
  name: string;
  email: string;
  goal: string;
  progress: number;
  nextSession: string;
  status: 'active' | 'pending' | 'completed';
}

const NutClients: FC = () => {
   const [messageDialogOpen, setMessageDialogOpen] = useState(false)
   const [dialogOpen, setDialogOpen] = useState(false);
   const [messageText, setMessageText] = useState("")
   const user = JSON.parse(localStorage.getItem("user") || "{}");
   const token = localStorage.getItem("token");
   const navigate = useNavigate();
   const [formData, setFormData] = useState({
       name: "",
       age: "",
       email: "",
       phone: "",
       gender: "",
       location: "",
       nextSession: "",
       plan: "",
       issue: "",
     });
    const handleBulkMessage = async() => {
      if (!messageText.trim()) return;
      const content = messageText.trim();

      try {
        const nutDetails = await api.get(`/nuts/email`, {
          params: { email: user.email },
          headers: { Authorization: `Bearer ${token}` },
        });
        const nutritionistId = nutDetails.data[0].id;
        const clientDetails = await api.get(`/client/byNutId`, {
          params: { id: nutritionistId },
          headers: { Authorization: `Bearer ${token}` },
        });
        const clients = clientDetails.data;
        const now = new Date().toISOString();
        // Loop through all clients and send message
        await Promise.all(
          clients.map(async (client) => {
            const messagePayload = {
              nId: nutritionistId,
              cId: client.id,
              content,
              sentAt: now,
            };
            return api.post(`/nuts/sendMessage`, messagePayload, {
              headers: { Authorization: `Bearer ${token}` },
            });
          })
        );
        setMessageText('');
        toast.success(`Message sent to all ${clients.length} clients ✅`);
        setMessageDialogOpen(false);
      } catch (err) {
        console.error("Failed to send bulk messages:", err);
        toast.error("Failed to send messages ❌");
      }
    } 
    const handleAddClient = async () => {
        const { name, age, email, phone, gender, location, issue, plan } = formData;
        if (!name || !age || !email || !phone || !gender || !location || !issue || !plan) {
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


          const response = await api.post(`/client/add`, newClient, {
            headers: { Authorization: `Bearer ${token}` },
          });

          
          // setCuserName(email);
          // setCPassword(response.data.password);

          alert("username is " + response.data.email +" and " + " password: " + response.data.password)

          setClients((prev) => [...prev, newClient]);
          setFormData({
            name: "",
            age: "",
            email: "",
            phone: "",
            gender: "",
            plan: "",
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

   if(!token){
    navigate("/login")
   }
   const [clients, setClients] = useState([])
   useEffect(() => {
      const fetchData = async() => {
         const nutDetails = await api.get(`/nuts/email`, {
          params: { email: user.email },
          headers: { Authorization: `Bearer ${token}` },
        });
        const clientDetails = await api.get(`/client/byNutId`, {
          params: { id: nutDetails.data[0].id },
          headers: { Authorization: `Bearer ${token}` },
        });

        setClients(clientDetails.data);
      } 
      fetchData()
   })
  // const clients: Client[] = [
  //   {
  //     id: '1',
  //     name: 'John Doe',
  //     email: 'john@example.com',
  //     goal: 'Weight Loss',
  //     progress: 65,
  //     nextSession: '2024-02-01',
  //     status: 'active'
  //   },
  //   {
  //     id: '2',
  //     name: 'Jane Smith',
  //     email: 'jane@example.com',
  //     goal: 'Muscle Gain',
  //     progress: 40,
  //     nextSession: '2024-02-03',
  //     status: 'active'
  //   }
  // ];

  return (
    <DashboardLayout title="My Clients" userRole="nutritionist">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Client Management</h1>
          <div className="space-x-4">
            <Button variant="outline" className='bg-primary-500 text-white' onClick={() => setMessageDialogOpen(true)}>Send Bulk Message</Button>
            {/* <Button className="bg-primary-500">Add New Client</Button> */}
            <Button variant="outline" className="bg-primary-500 text-white"  onClick={() => setDialogOpen(true)}>Add Client</Button> 
        
          </div>
        </div>

        

        <Separator />

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Client List</CardTitle>
          </CardHeader>

          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-muted-foreground text-xs uppercase">Name</TableHead>
                  <TableHead className="text-muted-foreground text-xs uppercase">Email</TableHead>
                  <TableHead className="text-muted-foreground text-xs uppercase">Weight (kg)</TableHead>
                  <TableHead className="text-muted-foreground text-xs uppercase">Goal</TableHead>
                  <TableHead className="text-muted-foreground text-xs uppercase">Issue</TableHead>
                  <TableHead className="text-muted-foreground text-xs uppercase">Allergies</TableHead>
                  <TableHead className="text-muted-foreground text-xs uppercase">Progress</TableHead>
                  <TableHead className="text-muted-foreground text-xs uppercase">Last Session</TableHead>
                  <TableHead className="text-muted-foreground text-xs uppercase">Next Session</TableHead>
                  {/* <TableHead className="text-muted-foreground text-xs uppercase">Status</TableHead> */}
                  <TableHead className="text-muted-foreground text-xs uppercase">Actions</TableHead>
                  
                </TableRow>
              </TableHeader>

              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.weight}</TableCell>
                    <TableCell>{client.goal || <span className="text-gray-400">-</span>}</TableCell>
                    <TableCell>{client.issue || <span className="text-gray-400">-</span>}</TableCell>
                    <TableCell>{client.allergies || <span className="text-gray-400">-</span>}</TableCell>
                    
                    {/* Progress bar */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-500 h-2 rounded-full"
                            style={{ width: `${client.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">{client.progress}%</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-sm text-gray-600">{client.lastSession}</TableCell>
                    <TableCell className="text-sm text-gray-600">{client.nextSession}</TableCell>

                    {/* Status Badge */}
                    {/* <TableCell>
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          client.status === "active"
                            ? "bg-green-100 text-green-700"
                            : client.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {client.status}
                      </span>
                    </TableCell> */}

                    {/* Actions */}
                    <TableCell>
                      {/* <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="hover:text-primary-500">
                              <CalendarClock className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Schedule</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider> */}
                      <div className="flex items-center gap-2">
                         <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary-600 hover:text-primary-700"
                        >
                          Add Mealplan
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="text-white bg-red-500"
                          
                        >
                          Delete User
                        </Button>
                       
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
           <DialogContent>
              <DialogHeader>
                <DialogTitle>Sending Bulk Message to all your clients</DialogTitle>
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
                <Button onClick={handleBulkMessage}>Send</Button>
              </DialogFooter>
            </DialogContent>
        </Dialog>


        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent
            className="max-w-md w-full max-h-[90vh] overflow-y-auto rounded-2xl p-6 sm:p-8"
          >
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl">Add New Client</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              {[
                "name",
                "age",
                "email",
                "phone",
                "gender",
                "location",
                "issue",
                "plan",
                "nextSession",
              ].map((field) => (
                <div key={field} className="space-y-2">
                  <Label htmlFor={field} className="text-sm font-medium text-gray-700">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </Label>
                  <Input
                    id={field}
                    type={
                      field === "age"
                        ? "number"
                        : field === "nextSession"
                        ? "date"
                        : "text"
                    }
                    value={(formData as any)[field]}
                    onChange={(e) =>
                      setFormData({ ...formData, [field]: e.target.value })
                    }
                    className="w-full"
                  />
                </div>
              ))}
            </div>

            <DialogFooter className="mt-6">
              <Button onClick={handleAddClient} className="w-full sm:w-auto">
                Generate Credentials
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </DashboardLayout>
  );
};

export default NutClients;
