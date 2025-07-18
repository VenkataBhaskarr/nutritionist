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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";


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
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    client: any | null;
  }>({ open: false, client: null });
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [selectedWeek, setSelectedWeek] = useState("");
  const [weight, setWeight] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
  const navigate = useNavigate();
  
  const [progressDialog, setProgressDialog] = useState<{
    open: boolean;
    client: any | null;
  }>({ open: false, client: null });
  
  const [mealPlanDialog, setMealPlanDialog] = useState<{
    open: boolean;
    client: any | null;
  }>({ open: false, client: null });

  const [mealInputs, setMealInputs] = useState({
    breakfast: "",
    lunch: "",
    snack: "",
    dinner: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    phone: "",
    gender: "",
    location: "",
    nextSession: "",
    plan: "",
    planDescription: "",
    issue: "",
  });

  // Add state for custom plan input
  const [customPlan, setCustomPlan] = useState("");

  const [clients, setClients] = useState([]);

  // Get user and token with proper error handling
  const getUserAndToken = () => {
    try {
      const userStr = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      
      if (!token) {
        navigate("/login");
        return { user: null, token: null };
      }
      
      let user = {};
      if (userStr) {
        try {
          user = JSON.parse(userStr);
        } catch (parseError) {
          console.error("Error parsing user data:", parseError);
          localStorage.removeItem("user"); // Remove corrupted data
          navigate("/login");
          return { user: null, token: null };
        }
      }
      
      if (!user || typeof user !== 'object' || !user.email) {
        navigate("/login");
        return { user: null, token: null };
      }
      
      return { user, token };
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      navigate("/login");
      return { user: null, token: null };
    }
  };

  const submitProgress = async () => {
    if (!selectedWeek || !weight) {
      toast.error("Please select week and enter weight.");
      return;
    }

    const { token } = getUserAndToken();
    if (!token) return;

    try {
      await api.post(
        "/client/progress",
        {
          clientId: progressDialog.client?.id,
          week: selectedWeek,
          weight: parseFloat(weight),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Progress updated successfully!");
      setProgressDialog({ open: false, client: null });
      setSelectedWeek("");
      setWeight("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update progress.");
    }
  };

  const handleDeleteClient = async () => {
    if (!deleteDialog.client) return;

    const { token } = getUserAndToken();
    if (!token) return;

    try {
      const data = {
        cId: deleteDialog.client.id,
        email: deleteDialog.client.email,
      };
      
      await api.post("/nuts/deleteClient", data, { 
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success(`Deleted ${deleteDialog.client.name} ✅`);
      
      setClients((prev) =>
        prev.filter((client) => client.id !== deleteDialog.client?.id)
      );

      setDeleteDialog({ open: false, client: null });
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete user ❌");
    }
  };

  const handleBulkMessage = async () => {
    if (!messageText.trim()) return;
    
    const { user, token } = getUserAndToken();
    if (!user || !token) return;

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
  };

  const handleAddClient = async () => {
    const { name, age, email, phone, gender, location, issue, planDescription } = formData;
    
    // Determine the final plan value
    const finalPlan = formData.plan === "Custom" ? customPlan : formData.plan;
    
    if (!name || !age || !email || !phone || !gender || !location || !issue || !finalPlan) {
      toast.error("Please fill in all the fields.");
      return;
    }

    // Additional validation for custom plan
    if (formData.plan === "Custom" && !customPlan.trim()) {
      toast.error("Please enter your custom plan.");
      return;
    }

    const { user, token } = getUserAndToken();
    if (!user || !token) return;

    try {
      const nutDetails = await api.get(`/nuts/email`, {
        params: { email: user.email },
        headers: { Authorization: `Bearer ${token}` },
      });

      const newClient = {
        ...formData,
        plan: finalPlan, // Use the final plan value instead of formData.plan
        nId: nutDetails.data[0].id,
      };

      await api.post(`/client/add`, newClient, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFormData({
        name: "",
        age: "",
        email: "",
        phone: "",
        gender: "",
        plan: "",
        location: "",
        issue: "",
        planDescription: "",
        nextSession: "",
      });

      // Reset custom plan
      setCustomPlan("");

      toast.success("Client added successfully!");
      setDialogOpen(false);

      // Refresh the client list
      await fetchData();
    } catch (error) {
      console.error("Add client error:", error);
      toast.error("Failed to add client.");
    }
  };

  const submitMealPlan = async () => {
    if (!mealPlanDialog.client) return;

    const { user, token } = getUserAndToken();
    if (!user || !token) return;

    try {
      const nutDetails = await api.get(`/nuts/email`, {
        params: { email: user.email },
        headers: { Authorization: `Bearer ${token}` },
      });

      const payload = {
        nId: nutDetails.data[0].id,
        cId: mealPlanDialog.client.id,
        meals: mealInputs,
      };

      await api.post("/nuts/addMealPlan", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      toast.success("Meal plan sent 🍽️");

      setMealInputs({
        breakfast: "",
        lunch: "",
        snack: "",
        dinner: "",
      });
      setMealPlanDialog({ open: false, client: null });
    } catch (err) {
      console.error("Error sending meal plan", err);
      toast.error("Failed to send meal plan ❌");
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { user, token } = getUserAndToken();
      if (!user || !token) return;

      const nutDetails = await api.get(`/nuts/email`, {
        params: { email: user.email },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!nutDetails.data || nutDetails.data.length === 0) {
        throw new Error("Nutritionist details not found");
      }

      const clientDetails = await api.get(`/client/byNutId`, {
        params: { id: nutDetails.data[0].id },
        headers: { Authorization: `Bearer ${token}` },
      });

      const clients = clientDetails.data || [];
      console.log(clients);

      // Fetch all client goals in parallel
      const clientsWithGoals = await Promise.all(
        clients.map(async (client) => {
          try {
            const goalRes = await api.get(`/client/goal`, {
              params: { clientId: client.id },
              headers: { Authorization: `Bearer ${token}` },
            });
            const goal = goalRes.data?.[0]?.title ?? "";
            const progress = goalRes.data?.[0]?.progress ?? 0;
            return { ...client, progress, goal };
          } catch (error) {
            console.error(`Failed to fetch goals for client ${client.id}`, error);
            return { ...client, progress: 0, goal: "" };
          }
        })
      );

      setClients(clientsWithGoals);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load client data. Please try again.");
      
      // Check if it's an authentication error
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <DashboardLayout title="My Clients" userRole="nutritionist">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading clients...</div>
        </div>
      </DashboardLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <DashboardLayout title="My Clients" userRole="nutritionist">
        <div className="flex flex-col justify-center items-center h-64 space-y-4">
          <div className="text-lg text-red-600">{error}</div>
          <Button onClick={fetchData}>Retry</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="My Clients" userRole="nutritionist">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Client Management</h1>
          <div className="space-x-4">
            <Button variant="outline" className='bg-primary-500 text-white' onClick={() => setMessageDialogOpen(true)}>
              Send Bulk Message
            </Button>
            <Button variant="outline" className="bg-primary-500 text-white" onClick={() => setDialogOpen(true)}>
              Add Client
            </Button> 
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
                  <TableHead className="text-muted-foreground text-xs uppercase">Issue</TableHead>
                  <TableHead className="text-muted-foreground text-xs uppercase">Goal</TableHead>
                  <TableHead className="text-muted-foreground text-xs uppercase">Allergies</TableHead>
                  <TableHead className="text-muted-foreground text-xs uppercase">Progress</TableHead>
                  <TableHead className="text-muted-foreground text-xs uppercase">Last Session</TableHead>
                  <TableHead className="text-muted-foreground text-xs uppercase">Next Session</TableHead>
                  <TableHead className="text-muted-foreground text-xs uppercase">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.weight}</TableCell>
                    <TableCell>{client.issue || <span className="text-gray-400">-</span>}</TableCell>
                    <TableCell>{client.goal || <span className="text-gray-400">-</span>}</TableCell>
                    <TableCell>{client.allergies || <span className="text-gray-400">-</span>}</TableCell>
                    
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

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary-600 hover:text-primary-700"
                          onClick={() => setProgressDialog({ open: true, client })}
                        >
                          Add Progress
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary-600 hover:text-primary-700"
                          onClick={() => setMealPlanDialog({ open: true, client })}
                        >
                          Add Mealplan
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="text-white bg-red-500"
                          onClick={() => setDeleteDialog({ open: true, client })}
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

        {/* All your existing dialogs remain the same */}
        <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, client: null })}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle className="text-red-600">Delete Client</DialogTitle>
              <DialogDescription>
                This action is <span className="font-bold">permanent</span> and <span className="font-bold">cannot be undone</span>.
                Are you sure you want to delete <span className="font-medium">{deleteDialog.client?.name}</span>?
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="flex justify-between mt-4">
              <Button variant="ghost" onClick={() => setDeleteDialog({ open: false, client: null })}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteClient}>
                Yes, Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={progressDialog.open} onOpenChange={(open) => setProgressDialog({open, client: null})}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>
                Update Progress for {progressDialog.client?.name}
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-1">
                <Label>Select Week</Label>
                <Select
                  value={selectedWeek}
                  onValueChange={(val) => setSelectedWeek(val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a week" />
                  </SelectTrigger>
                  <SelectContent>
                    {weeks.map((week, idx) => (
                      <SelectItem key={idx} value={week}>
                        {week}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1">
                <Label>Weight (kg)</Label>
                <Input
                  type="number"
                  placeholder="Enter weight in kgs"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button onClick={submitProgress}>Submit Progress</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={mealPlanDialog.open} onOpenChange={(open) => setMealPlanDialog({ open, client: null })}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Meal Plan for {mealPlanDialog.client?.name}</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {["breakfast", "lunch", "snack", "dinner"].map((meal) => (
                <div key={meal} className="flex flex-col gap-1">
                  <Label className="capitalize">{meal}</Label>
                  <Input
                    placeholder={`Enter ${meal} food`}
                    value={mealInputs[meal as keyof typeof mealInputs]}
                    onChange={(e) =>
                      setMealInputs((prev) => ({
                        ...prev,
                        [meal]: e.target.value,
                      }))
                    }
                  />
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button onClick={submitMealPlan}>Send Plan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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
          <DialogContent className="max-w-md w-full max-h-[90vh] overflow-y-auto rounded-2xl p-6 sm:p-8">
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
                "planDescription",
                "nextSession",
              ].map((field) => (
                <div key={field} className="space-y-2">
                  <Label htmlFor={field} className="text-sm font-medium text-gray-700">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </Label>

                  {field === "plan" ? (
                    <>
                      <select
                        id={field}
                        value={formData[field]}
                        onChange={(e) => {
                          setFormData({ ...formData, [field]: e.target.value });
                          // Clear custom plan when switching away from Custom
                          if (e.target.value !== "Custom") {
                            setCustomPlan("");
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-500"
                      >
                        <option value="">Select a plan</option>
                        <option value="Weight Management">Weight Management</option>
                        <option value="Diabetes">Diabetes</option>
                        <option value="Thyroid Health">Thyroid Health</option>
                        <option value="PCOD, PCOS">PCOD, PCOS</option>
                        <option value="Hyper Tension">Hyper Tension</option>
                        <option value="Kids Health">Kids Health</option>
                        <option value="Organ Health">Organ Health</option>
                        <option value="Custom">Custom Plan</option>
                      </select>
                      
                      {/* Custom plan input field */}
                      {formData.plan === "Custom" && (
                        <div className="mt-2">
                          <Label htmlFor="customPlan" className="text-sm font-medium text-gray-700">
                            Enter Your Custom Plan
                          </Label>
                          <Input
                            id="customPlan"
                            type="text"
                            placeholder="Type your custom plan..."
                            value={customPlan}
                            onChange={(e) => setCustomPlan(e.target.value)}
                            className="w-full mt-1"
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <Input
                      id={field}
                      type={
                        field === "age"
                          ? "number"
                          : field === "nextSession"
                          ? "date"
                          : "text"
                      }
                      value={formData[field]}
                      onChange={(e) =>
                        setFormData({ ...formData, [field]: e.target.value })
                      }
                      className="w-full"
                    />
                  )}
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