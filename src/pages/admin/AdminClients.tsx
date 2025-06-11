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
import {toast} from "sonner"
import { useNavigate } from 'react-router-dom';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  age: number;
  gender: string;
  nutritionist: string;
  nutritionistId: number;
  nextSession: string;
}

const AddClientDialog: FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [age, setAge] = useState("");
   const [issue, setIssue] = useState("");
    const [nextSession, setNextSession] = useState("");
     const [plan, setPlan] = useState("");
  const [gender, setGender] = useState("");
  const [nutritionistId, setNutritionistId] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [joinDate, setJoinDate] = useState("");
  const [nutritionists, setNutritionists] = useState<{ id: string; name: string }[]>([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchNutritionists = async () => {
      try {
        const token = localStorage.getItem("token");
        
           if(!token){
            navigate("/login")
           }
        const response = await api.get('/nuts/nutritionists', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNutritionists(
          Array.isArray(response.data)
            ? response.data.map((n) => ({ id: n.id, name: n.name }))
            : []
        );
      } catch (err) {
        setError("Failed to fetch nutritionists.");
      }
    };
    fetchNutritionists();
  }, []);

  
  const handleSubmit = async (e: React.FormEvent) => {
    // console.log("submitted")
  e.preventDefault();

  if (!name || !email || !phone || !age || !gender || !nutritionistId || !joinDate) {
    setError("Required fields are missing.");
    return;
  }

  try {
    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    // console.log("Posting client...");

    const response = await api.post(
      "/client/add",
      {
        name,
        email,
        phone,
        location,
        age: parseInt(age),
        gender,
        nId: nutritionistId, // ← fixed this line
        issue,
        nextSession: joinDate, // ← make sure backend expects this
        plan,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // alert("username is " + response.data.email + " password is " + response.data.password)

    setError("");
    // Clear form
    setName("");
    setEmail("");
    setPhone("");
    setLocation("");
    setAge("");
    setGender("");
    setNutritionistId("");
    setIssue("");
    setNextSession("");
    setPlan("");

    onSuccess?.();
    toast.success("Client added successfully!");
  } catch (err) {
    console.error("Client addition error:", err);
    setError("Failed to add client. Please try again.");
    toast.error("Failed to add client")
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-primary-500 hover:bg-primary-600">Add New Client</Button>
      </DialogTrigger>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-lg w-[95vw]'>
        <DialogHeader>
          <DialogTitle>Add Client</DialogTitle>
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
            <Label htmlFor="issue">Issue</Label>
            <Input id="issue" value={issue} onChange={(e) => setIssue(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="plan">Plan</Label>
            <Input id="plan" value={plan} onChange={(e) => setPlan(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="age">Age</Label>
            <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="gender">Gender</Label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <Label htmlFor="nutritionistId">Nutritionist</Label>
            <select
              id="nutritionistId"
              value={nutritionistId}
              onChange={(e) => setNutritionistId(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select Nutritionist</option>
              {nutritionists.map((n) => (
                <option key={n.id} value={n.id}>{n.name}</option>
              ))}
            </select>
          </div>
          {/* <div>
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
          </div> */}
          <div>
            <Label htmlFor="nextSession">Next Session</Label>
            <Input id="nextSession" type="date" value={joinDate} onChange={(e) => setJoinDate(e.target.value)} required />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" disabled={isSubmitting} className="w-full bg-primary-500 hover:bg-primary-600">
            {isSubmitting ? "Adding..." : "Add Client"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const AdminClients: FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [nutritionists, setNutritionists] = useState<{ id: string; name: string }[]>([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  

  // Assuming you already have nutritionists state filled
useEffect(() => {
  const fetchData = async () => {
    try {
      if (!token) {
        navigate("/login");
        return;
      }

      // Step 1: Fetch nutritionists
      const nutResponse = await api.get('/nuts/nutritionists', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const nutritionistsData = Array.isArray(nutResponse.data)
        ? nutResponse.data.map((n) => ({ id: n.id, name: n.name }))
        : [];

      setNutritionists(nutritionistsData);

      // Build nutritionist map
      const nutritionistMap = new Map(
        nutritionistsData.map((n) => [n.id, n.name])
      );

      // Step 2: Fetch clients
      const clientResponse = await api.get('/client/clients', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const rawClients = Array.isArray(clientResponse.data)
        ? clientResponse.data
        : [];

      // Enrich with nutritionist names
      const enrichedClients = rawClients.map((client) => ({
        ...client,
        nutritionist: nutritionistMap.get(client.nId) || 'Unknown',
      }));

      setClients(enrichedClients);
    } catch (error) {
      console.error("Error in fetchData:", error);
      setError("Failed to fetch data.");
      setClients([]);
    }
  };

  fetchData();
}, []);
 // Re-run when nutritionists are ready


  const activeCount = clients.filter(c => c.status === 'active').length;
  const inactiveCount = clients.length - activeCount;

  if (isLoading) {
    return (
      <DashboardLayout title="Client Management" userRole="admin">
        <div className="p-4">Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Client Management" userRole="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Client Management</h1>
          <AddClientDialog onSuccess={() => window.location.reload()} />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{clients.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Active Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{activeCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Inactive Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{inactiveCount}</p>
            </CardContent>
          </Card>
        </div>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>Client List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Nutritionist</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>NextSession</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.length > 0 ? (
                  clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>{client.name}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.phone}</TableCell>
                      <TableCell>{client.location || 'Not provided'}</TableCell>
                      <TableCell>{client.nutritionist}</TableCell>
                      <TableCell>{client.gender}</TableCell>
                       <TableCell>{client.nextSession}</TableCell>
                      {/* <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            client.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {client.status}
                        </span>
                      </TableCell> */}
                      {/* <TableCell>{client.nextSession}</TableCell> */}
                      <TableCell className="flex gap-2">
                        {/* <EditClientDialog client={client} onSuccess={() => window.location.reload()} /> */}
                        {/* <DeleteClientDialog id={client.id} onSuccess={() => window.location.reload()} /> */}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-gray-500">
                      No clients found.
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



// const EditClientDialog: FC<{ client: Client; onSuccess?: () => void }> = ({ client, onSuccess }) => {
//   const [name, setName] = useState(client.name);
//   const [email, setEmail] = useState(client.email);
//   const [phone, setPhone] = useState(client.phone);
//   const [location, setLocation] = useState(client.location);
//   const [age, setAge] = useState(client.age.toString());
//   const [gender, setGender] = useState(client.gender);
//   const [nutritionistId, setNutritionistId] = useState(client.nutritionistId.toString());
//   const [status, setStatus] = useState(client.status);
//   const [nutritionists, setNutritionists] = useState<{ id: string; name: string }[]>([]);
//   const [error, setError] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchNutritionists = async () => {
//       try {
//         const token = localStorage.getItem("token");

//    if(!token){
//     navigate("/login")
//    }
//         const response = await api.get('/nuts/nutritionists', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setNutritionists(
//           Array.isArray(response.data)
//             ? response.data.map((n) => ({ id: n.id, name: n.name }))
//             : []
//         );
//       } catch (err) {
//         setError("Failed to fetch nutritionists.");
//       }
//     };
//     fetchNutritionists();
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!name || !email || !phone || !age || !gender || !nutritionistId) {
//       setError("Required fields are missing.");
//       return;
//     }
//     try {
//       setIsSubmitting(true);
//       const token = localStorage.getItem("token");
//       const navigate = useNavigate();
//    if(!token){
//     navigate("/login")
//    }
//       await api.put(
//         `/clients/${client.id}`,
//         {
//           name,
//           email,
//           phone,
//           location,
//           age: parseInt(age),
//           gender,
//           nutritionistId: parseInt(nutritionistId),
//           status,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setError("");
//       onSuccess?.();
//       alert("Client updated successfully!");
//     } catch (err) {
//       setError("Failed to update client. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="ghost" size="sm">Edit</Button>
//       </DialogTrigger>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Edit Client</DialogTitle>
//         </DialogHeader>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <Label htmlFor="name">Name</Label>
//             <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
//           </div>
//           <div>
//             <Label htmlFor="email">Email</Label>
//             <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
//           </div>
//           <div>
//             <Label htmlFor="phone">Phone</Label>
//             <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
//           </div>
//           <div>
//             <Label htmlFor="location">Address</Label>
//             <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
//           </div>
//           <div>
//             <Label htmlFor="age">Age</Label>
//             <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
//           </div>
//           <div>
//             <Label htmlFor="gender">Gender</Label>
//             <select
//               id="gender"
//               value={gender}
//               onChange={(e) => setGender(e.target.value)}
//               className="w-full p-2 border rounded-md"
//               required
//             >
//               <option value="">Select Gender</option>
//               <option value="Male">Male</option>
//               <option value="Female">Female</option>
//               <option value="Other">Other</option>
//             </select>
//           </div>
//           <div>
//             <Label htmlFor="nutritionistId">Nutritionist</Label>
//             <select
//               id="nutritionistId"
//               value={nutritionistId}
//               onChange={(e) => setNutritionistId(e.target.value)}
//               className="w-full p-2 border rounded-md"
//               required
//             >
//               <option value="">Select Nutritionist</option>
//               {nutritionists.map((n) => (
//                 <option key={n.id} value={n.id}>{n.name}</option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <Label htmlFor="status">Status</Label>
//             <select
//               id="status"
//               value={status}
//               onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
//               className="w-full p-2 border rounded-md"
//             >
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//             </select>
//           </div>
//           {error && <p className="text-red-500 text-sm">{error}</p>}
//           <Button type="submit" disabled={isSubmitting} className="w-full bg-primary-500 hover:bg-primary-600">
//             {isSubmitting ? "Updating..." : "Update Client"}
//           </Button>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };

// const DeleteClientDialog: FC<{ id: string; onSuccess?: () => void }> = ({ id, onSuccess }) => {
//   const [error, setError] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       setIsSubmitting(true);
//       const token = localStorage.getItem("token");
//       const navigate = useNavigate();
//    if(!token){
//     navigate("/login")
//    }
//       await api.delete(`/clients/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setError("");
//       onSuccess?.();
//       alert("Client deleted successfully!");
//     } catch (err) {
//       setError("Failed to delete client. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="ghost" size="sm" className="text-red-600">Delete</Button>
//       </DialogTrigger>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Delete Client</DialogTitle>
//         </DialogHeader>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <p>Are you sure you want to delete this client?</p>
//           {error && <p className="text-red-500 text-sm">{error}</p>}
//           <Button type="submit" disabled={isSubmitting} className="w-full bg-red-500 hover:bg-red-600">
//             {isSubmitting ? "Deleting..." : "Confirm Delete"}
//           </Button>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };

export default AdminClients;