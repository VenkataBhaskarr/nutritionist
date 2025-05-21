import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import axios from "axios";
import api from "@/lib/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password || !role) {
      toast.error("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      // const response = await axios.post("http://localhost:3000/api/users/login", {
      //   email,
      //   password,
      //   role
      // });
    
       const response = await api.post("/users/login", {
        email,
        password,
        role,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({
        email: user.email,
        role: user.role
      }));

      toast.success(`Logged in as ${user.role}`);
      navigate(`/dashboard/${user.role}`);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Invalid credentials";
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
          <span className="text-2xl font-bold">Livin Singnificant</span>
        </Link>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
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
                <Label htmlFor="role">Login As</Label>
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
              
              <Button
                type="submit"
                className="w-full bg-primary-500 hover:bg-primary-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
            
            {/* <div className="mt-4 text-center">
              <a href="#" className="text-sm text-primary-500 hover:underline">
                Forgot password?
              </a>
            </div> */}
          </CardContent>
          {/* <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500">
              Don't you have an account?{" "}
              <Link to="/signup" className="text-primary-500 hover:underline">
                Sign Up
              </Link>
            </p>
          </CardFooter> */}
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

export default Login;