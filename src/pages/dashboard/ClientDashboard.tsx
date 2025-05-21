import axios from "axios"
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import {
  Calendar,
  ClipboardList,
  TrendingUp,
  User
} from "lucide-react";

// Mock data for the demo
const MOCK_CLIENT = {
  name: "Michael Brown",
  email: "michael@example.com",
  plan: "Weight Loss",
  startDate: "2023-04-01",
  nutritionist: {
    name: "Dr. Emma Smith",
    email: "emma@example.com",
    specialty: "Sports Nutrition"
  },
  nextAppointment: {
    date: "2023-05-20",
    time: "10:00 AM"
  },
  progress: [
    { week: "Week 1", weight: 180 },
    { week: "Week 2", weight: 178 },
    { week: "Week 3", weight: 177 },
    { week: "Week 4", weight: 175 }
  ],
  mealPlan: [
    { meal: "Breakfast", food: "Oatmeal with berries and nuts" },
    { meal: "Lunch", food: "Grilled chicken salad with olive oil dressing" },
    { meal: "Snack", food: "Greek yogurt with honey" },
    { meal: "Dinner", food: "Baked salmon with steamed vegetables" }
  ]
};

const ClientDashboard = () => {
  const user = localStorage.getItem("user")
  const [clientData, setClientData] = useState(MOCK_CLIENT);
  const [nutData, setNutData] = useState({
    name: "",
    email: "",
  })
  useEffect(() => {
    const fetchData = async() => {
      const userJSONValue = JSON.parse(user)
      const email = encodeURIComponent(userJSONValue.email);
      const token = localStorage.getItem("token")
      const clientDetails = await api.get(`/client/email`, {
        params: { email:userJSONValue.email },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(clientDetails)
      const nuttData = await api.get(`/nuts/id`, {
        params: {
          id: clientDetails.data[0].nId
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setNutData(nuttData.data[0])
      //  console.log(nuttData.data[0])
     // const clientDetails = await axios.get("http://localhost:3000/api/client"+"/"+userJSONValue.email)
      
      setClientData((data) => ({
        ...data,
        name: clientDetails.data[0].name,
        email: clientDetails.data[0].email,
      }))
    }
    fetchData()
  }, [])
  const navigate = useNavigate();

  return (
    <DashboardLayout title="Client Dashboard" userRole="client">
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h2 className="text-2xl font-bold mb-2">Welcome back, {clientData.name}!</h2>
                <p className="text-gray-600">
                  Your {clientData.plan} plan is making great progress. Keep it up!
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <Button className="bg-primary-500 hover:bg-primary-600">
                  Contact Nutritionist
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Stats and Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-primary-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Next Appointment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-xl font-bold">{clientData.nextAppointment.date}</div>
                  <div className="text-gray-500 text-sm">{clientData.nextAppointment.time}</div>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-primary-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-primary-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Current Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-xl font-bold">{clientData.plan}</div>
                  <div className="text-gray-500 text-sm">Started {clientData.startDate}</div>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <ClipboardList className="h-6 w-6 text-primary-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-primary-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-xl font-bold">-5 lbs</div>
                  <div className="text-gray-500 text-sm">Last 4 weeks</div>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-primary-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Nutritionist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-xl font-bold">{nutData.name}</div>
                  {/* <div className="text-gray-500 text-sm">{clientData.nutritionist.specialty}</div> */}
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-primary-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Progress Card */}
          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
              <CardDescription>Weight tracking over the past 4 weeks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end space-x-2">
                {clientData.progress.map((progress, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="bg-primary-500 rounded-t-md w-full" 
                      style={{ 
                        height: `${((progress.weight - 170) / 15) * 100}%`,
                        minHeight: "10%"
                      }} 
                    />
                    <div className="mt-2 text-xs font-medium">{progress.week}</div>
                    <div className="text-sm">{progress.weight} lbs</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Meal Plan Card */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Meal Plan</CardTitle>
              <CardDescription>Recommended by Dr. Emma Smith</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clientData.mealPlan.map((meal, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mt-1 mr-3">
                      <span className="text-primary-500 text-sm font-bold">{meal.meal[0]}</span>
                    </div>
                    <div>
                      <h4 className="font-medium">{meal.meal}</h4>
                      <p className="text-gray-600">{meal.food}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Nutritionist Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Your Nutritionist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="md:w-1/4 mb-4 md:mb-0 flex justify-center">
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="h-12 w-12 text-primary-500" />
                </div>
              </div>
              <div className="md:w-3/4">
                <h3 className="text-xl font-bold mb-2">{nutData.name}</h3>
                {/* <p className="text-gray-600 mb-4">
                  Specialty: {clientData.nutritionist.specialty}
                </p> */}
                <p className="text-gray-600 mb-4">
                  Email: {nutData.email}
                </p>
                <div className="space-x-4">
                  <Button className="bg-primary-500 hover:bg-primary-600">
                    Message
                  </Button>
                  <Button variant="outline" className="border-primary-500 text-primary-500 hover:bg-primary-50">
                    Schedule Appointment
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>

  );
};

export default ClientDashboard;
