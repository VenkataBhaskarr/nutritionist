import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import api from "@/lib/api";

const ReachOut = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    concern: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/reachout",
        formData
      );

      toast.success("Thank you! We will reach out to you in 2 business days.", {
        duration: 15000,
      });

      setFormData({ name: "", email: "", concern: "" });
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid place-items-center min-h-screen md:grid-cols-2 bg-white px-4 md:px-0">
      {/* Left: Form */}
      <div className="w-full max-w-lg">
        <Card className="shadow-md border border-gray-200">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-semibold">
              Reach Out to Us
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <Input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Textarea
                name="concern"
                placeholder="What's your concern?"
                value={formData.concern}
                onChange={handleChange}
                rows={5}
                required
              />
              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? "Sending..." : "Submit"}
              </Button>
            </form>
          </CardContent>
        </Card>
         <div className="text-center mt-2">
            <p className="mt-5 text-sm text-center text-gray-500">
                <Link to="/" className="text-primary-500 hover:underline">← Back to Home</Link>
            </p>
        </div>
      </div>

      {/* Right: Visual */}
      <div className="hidden md:flex justify-end items-center pr-20">
        <img
          src="/logo.png"
          alt="Nutrition Visual"
          className="max-w-[500px] w-full"
        />
      </div>

     
    </div>
  );
};

export default ReachOut;
