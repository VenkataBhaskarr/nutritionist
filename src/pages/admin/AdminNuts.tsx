import { FC, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DashboardLayout from "@/components/DashboardLayout";
import api from "@/lib/api";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";

const AddNutritionistDialog: FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [specialization, setSpecialization] = useState("");
  
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !specialization ) {
      setError("Required fields are missing.");
      return;
    }
    try {
      setIsSubmitting(true);
      // const token = localStorage.getItem("token");
      // const navigate = useNavigate();
      //    if(!token){
      //     navigate("/login")
      //    }
      console.log("adding client")
      const response = await api.post(
        "/nuts/add",
        { name, email, phone, location, specialization},
      );
      // alert("username is " + response.data.email + " password is " + response.data.password)
      setError("");
      setName("");
      setEmail("");
      setPhone("");
      setLocation("");
      setSpecialization("");
      onSuccess?.();
      toast.success("Nutritionist added successfully!");
    } catch (err) {
      toast.error("Failed to add nutritionist")
      setError("Failed to add nutritionist. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-primary-500 hover:bg-primary-600">Add New Nutritionist</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Nutritionist</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="specialization">Specialization</Label>
            <Input id="specialization" value={specialization} onChange={(e) => setSpecialization(e.target.value)} required />
          </div>
         
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" disabled={isSubmitting} className="w-full bg-primary-500 hover:bg-primary-600">
            {isSubmitting ? "Adding..." : "Add Nutritionist"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const EditNutritionistDialog: FC<{ nutritionist: Nutritionist; onSuccess?: () => void }> = ({ nutritionist, onSuccess }) => {
  const [name, setName] = useState(nutritionist.name);
  const [email, setEmail] = useState(nutritionist.email);
  const [phone, setPhone] = useState(nutritionist.phone);
  const [location, setLocation] = useState(nutritionist.location);
  const [specialization, setSpecialization] = useState(nutritionist.specialization);
  const [status, setStatus] = useState(nutritionist.status);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !specialization) {
      setError("Required fields are missing.");
      return;
    }
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      const navigate = useNavigate();
   if(!token){
    navigate("/login")
   }
      await api.put(
        `/nutritionists/${nutritionist.id}`,
        { name, email, phone, location, specialization, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setError("");
      onSuccess?.();
      alert("Nutritionist updated successfully!");
    } catch (err) {
      setError("Failed to update nutritionist. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Nutritionist</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="location">Address</Label>
            <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="specialization">Specialization</Label>
            <Input id="specialization" value={specialization} onChange={(e) => setSpecialization(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
              className="w-full p-2 border rounded-md"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" disabled={isSubmitting} className="w-full bg-primary-500 hover:bg-primary-600">
            {isSubmitting ? "Updating..." : "Update Nutritionist"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const DeleteNutritionistDialog: FC<{ id: string; onSuccess?: () => void }> = ({ id, onSuccess }) => {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      const navigate = useNavigate();
   if(!token){
    navigate("/login")
   }
      await api.delete(`/nutritionists/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setError("");
      onSuccess?.();
      alert("Nutritionist deleted successfully!");
    } catch (err) {
      setError("Failed to delete nutritionist. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-red-600">Delete</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Nutritionist</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <p>Are you sure you want to delete this nutritionist?</p>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" disabled={isSubmitting} className="w-full bg-red-500 hover:bg-red-600">
            {isSubmitting ? "Deleting..." : "Confirm Delete"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface Nutritionist {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  specialization: string;
  clientCount: number;
  status: "active" | "inactive";
  joinDate: string;
}

// ... [Code for AddNutritionistDialog, EditNutritionistDialog, DeleteNutritionistDialog remains the same but uses lucide icons and fixed hook errors]

const AdminNutritionists: FC = () => {
  const navigate = useNavigate();
  const [nutritionists, setNutritionists] = useState<Nutritionist[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchNutritionists = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");
      setIsLoading(true);
      const { data } = await api.get("/nuts/nutritionists", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      //console.log(data)
      setNutritionists(Array.isArray(data) ? data : []);
    
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch nutritionists. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchNutritionists();
  }, [fetchNutritionists]);

  const activeCount = nutritionists.filter((n) => n.status === "active").length;
  const totalClients = nutritionists.reduce((sum, n) => sum + n.clientCount, 0);

  return (
    <DashboardLayout title="Nutritionist Management" userRole="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Nutritionist Management</h1>
          <AddNutritionistDialog onSuccess={fetchNutritionists} />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Nutritionists</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{nutritionists.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Active Nutritionists</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{activeCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalClients}</p>
            </CardContent>
          </Card>
        </div>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>Nutritionist List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead>Clients</TableHead>
                 
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nutritionists.length > 0 ? (
                  nutritionists.map((n) => (
                    <TableRow key={n.id}>
                      <TableCell>{n.name}</TableCell>
                      <TableCell>{n.email}</TableCell>
                      <TableCell>{n.phone}</TableCell>
                      <TableCell>{n.location || "-"}</TableCell>
                      <TableCell>{n.specialization}</TableCell>
                      <TableCell>{n.clientCount}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            n.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {n.status}
                        </span>
                      </TableCell>
                     
                      <TableCell className="flex gap-2">
                        <EditNutritionistDialog nutritionist={n} onSuccess={fetchNutritionists} />
                        <DeleteNutritionistDialog id={n.id} onSuccess={fetchNutritionists} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground">
                      No nutritionists found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminNutritionists;
