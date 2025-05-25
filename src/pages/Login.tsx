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
      <div className="min-h-screen grid md:grid-cols-2 bg-white">
  {/* Left Side - Form */}
  <div className="flex flex-col justify-center items-center px-6 py-12">
    <div className="w-full max-w-md space-y-6">
      <Link to="/" className="flex justify-center items-center space-x-2">
        <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center shadow-md">
          <span className="text-white font-semibold text-lg">N</span>
        </div>
        <span className="text-3xl font-bold tracking-tight text-gray-800">
          Livin Significant
        </span>
      </Link>

      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl text-center">Sign In</CardTitle>
          <CardDescription className="text-center text-gray-500">
            Welcome back! Log in to continue.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="role">Login As</Label>
              <Select onValueChange={setRole} value={role}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
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
        </CardContent>
      </Card>

      <p className="text-sm text-center text-gray-500">
        <Link to="/" className="text-primary-500 hover:underline">← Back to Home</Link>
      </p>
    </div>
  </div>

  {/* Right Side - Image */}
 <div className="hidden md:flex justify-end items-center pr-20">
  <img
    src="logo.png"
    alt="Nutrition Visual"
    className="max-w-[500px] w-full"
  />
</div>

</div>

  );
};

export default Login;