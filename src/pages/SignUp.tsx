import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import axios from "axios";
import { Link } from "react-router-dom";

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal"
];

const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    illness: "",
    phone: "",
    email: "",
    country: "",
    state: "",
    otp: ""
  });

  const [otpSent, setOtpSent] = useState(false);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSendOtp = async () => {
    if (!form.phone) return toast.error("Enter a valid phone number");
    // Placeholder for OTP sending API
    toast.success("OTP sent successfully");
    setOtpSent(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/signup", form);
      toast.success("Signed up successfully!");
    } catch (err) {
      toast.error("Failed to sign up");
    }
  };

  return (
    <div className="grid place-items-center min-h-screen md:grid-cols-2 bg-white">
      <div className="w-full max-w-lg">
        <Card className="shadow-md border border-gray-200">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-semibold">
               Get in touch with our nutritionists
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="illness">Illness you are suffering from</Label>
                <Input
                  id="illness"
                  value={form.illness}
                  onChange={(e) => handleChange("illness", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="phone">Phone</Label>
                <div className="flex gap-2">
                  <Input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    onClick={handleSendOtp}
                    className="bg-primary-500 text-white hover:bg-primary-600"
                  >
                    Send OTP
                  </Button>
                </div>
              </div>

              {otpSent && (
                <div className="space-y-1">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
                    value={form.otp}
                    onChange={(e) => handleChange("otp", e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="space-y-1">
                <Label>Country</Label>
                <Select onValueChange={(val) => handleChange("country", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="India">India</SelectItem>
                    <SelectItem value="Outside India">Outside India</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {form.country === "India" && (
                <div className="space-y-1">
                  <Label>State</Label>
                  <Select onValueChange={(val) => handleChange("state", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {indianStates.map((state) => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-primary-500 text-white hover:bg-primary-600"
              >
                Sign Up
              </Button>
            </form>
          </CardContent>
        </Card>
        <p className="mt-5 text-sm text-center text-gray-500">
                <Link to="/" className="text-primary-500 hover:underline">← Back to Home</Link>
        </p>
      </div>

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

export default SignUp;
