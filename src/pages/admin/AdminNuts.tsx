
import { FC, useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DashboardLayout from '@/components/DashboardLayout';
import api from "@/lib/api";

interface Nutritionist {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  specialization: string;
  clientCount: number;
  status: 'active' | 'inactive';
  joinDate: string;
}

const AddNutritionistDialog: FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [joinDate, setJoinDate] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !specialization || !joinDate) {
      setError("Required fields are missing.");
      return;
    }
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      await api.post(
        "/nutritionists",
        { name, email, phone, location, specialization, status, joinDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setError("");
      setName("");
      setEmail("");
      setPhone("");
      setLocation("");
      setSpecialization("");
      setStatus("active");
      setJoinDate("");
      onSuccess?.();
      alert("Nutritionist added successfully!");
    } catch (err) {
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
          <div>
            <Label htmlFor="joinDate">Join Date</Label>
            <Input id="joinDate" type="date" value={joinDate} onChange={(e) => setJoinDate(e.target.value)} required />
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

const AdminNutritionists: FC = () => {
  const [nutritionists, setNutritionists] = useState<Nutritionist[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNutritionists = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const response = await api.get('/nutritionists', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNutritionists(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error('Fetch error:', err);
        setError("Failed to fetch nutritionists. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchNutritionists();
  }, []);

  const activeCount = nutritionists.filter(n => n.status === 'active').length;
  const totalClients = nutritionists.reduce((sum, n) => sum + n.clientCount, 0);

  if (isLoading) {
    return (
      <DashboardLayout title="Nutritionist Management" userRole="admin">
        <div className="p-4">Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Nutritionist Management" userRole="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Nutritionist Management</h1>
          <AddNutritionistDialog onSuccess={() => window.location.reload()} />
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
                  <TableHead>Status</TableHead>
                  <TableHead>Join Date</TableHead>
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
                      <TableCell>{n.location || 'Not provided'}</TableCell>
                      <TableCell>{n.specialization}</TableCell>
                      <TableCell>{n.clientCount}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            n.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {n.status}
                        </span>
                      </TableCell>
                      <TableCell>{n.joinDate}</TableCell>
                      <TableCell className="flex gap-2">
                        <EditNutritionistDialog nutritionist={n} onSuccess={() => window.location.reload()} />
                        <DeleteNutritionistDialog id={n.id} onSuccess={() => window.location.reload()} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-gray-500">
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
