import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import api from "@/lib/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/users/forgotpassword", { email });
      toast.success("New password sent to your email.");
    } catch (error) {
      toast.error("Failed to reset password. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-white">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center px-6 py-12">
        <div className="w-full max-w-md space-y-6">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-center">Reset Password</CardTitle>
              <CardDescription className="text-center text-gray-500">
                Enter your email to receive a new password.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleForgotPassword} className="space-y-5">
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary-500 text-white hover:bg-primary-600"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="flex justify-center gap-12">
            <p className="text-sm text-center text-gray-500">
              <Link to="/" className="text-primary-500 hover:underline">
                ← Back to Home
              </Link>
            </p>
          </div>
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

export default ForgotPassword;
