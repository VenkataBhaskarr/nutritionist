import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import axios from "axios";
import api from "@/lib/api";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    age: "",
    phone: "",
    gender: "",
    location: "",
    issue: "",
    qualification: "",
  });

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password || !confirmPassword || !role) {
      toast.error("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    if(password.length < 8){
      toast.error("please enter password of minimum length 8 characters")
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post("/users/signup", {
        email,
        password,
        role,
        ...form
      });
      navigate(`/login`);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Signup failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center">
            <span className="text-white font-bold">N</span>
          </div>
          <span className="text-2xl font-bold">Livin Significant</span>
        </Link>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Sign Up</CardTitle>
            <CardDescription className="text-center">
              Create a new account to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Register As</Label>
                <Select onValueChange={setRole} value={role}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="nutritionist">Nutritionist</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {
                role == "" ? <div>nothing</div> : role == "client" ? <div>
                   <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange("name")}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={form.age}
                      onChange={handleChange("age")}
                      required
                    />
                 </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange("phone")}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Input
                    id="gender"
                    type="text"
                    value={form.gender}
                    onChange={handleChange("gender")}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    type="text"
                    value={form.location}
                    onChange={handleChange("location")}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issue">Issue</Label>
                  <Input
                    id="issue"
                    type="text"
                    value={form.issue}
                    onChange={handleChange("issue")}
                    required
                  />
                </div>
        
                </div> : role == "nutritionist" ? <div>
                   <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange("name")}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                  <Label htmlFor="qualification">Qualification</Label>
                  <Input
                    id="qualification"
                    type="text"
                    value={form.qualification}
                    onChange={handleChange("qualification")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange("phone")}
                    required
                  />
                </div>
                </div> : 
                 <div>Welcome Admin</div>
              }



              
              <Button
                type="submit"
                className="w-full bg-primary-500 hover:bg-primary-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Signing Up..." : "Sign Up"}
              </Button>
            </form>
            
            <div className="mt-4 text-center">
              <a href="#" className="text-sm text-primary-500 hover:underline">
                Need help?
              </a>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="text-primary-500 hover:underline">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
        
        <p className="text-center mt-4 text-gray-600">
          <Link to="/" className="text-primary-500 hover:underline">
            Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;