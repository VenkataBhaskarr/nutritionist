
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import NutritionistDashboard from "./pages/dashboard/NutritionistDashboard";
import ClientDashboard from "./pages/dashboard/ClientDashboard";
import Blogs from "./components/Blogs";
import Calculator from "./components/Calculator";
import AdminClients from "./pages/admin/AdminClients";
import AdminNuts from "./pages/admin/AdminNuts";
import AdminSettings from "./pages/admin/AdminSettings";
import BlogDetails from "@/components/BlogDetails"
import NutClients from "./pages/nut/NutClients";
import NutProfile from "./pages/nut/NutProfile";
import NutSettings from "./pages/nut/NutSettings";

import ClientNut from "./pages/client/ClientNut";
import ClientProfile from "./pages/client/ClientProfile";
import ClientSettings from "./pages/client/ClientSettings";

import NotFound from "./pages/NotFound";
import Signup from "./pages/SignUp";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/blogs" element={<Blogs />} />
           <Route path="/blogs/:id" element={<BlogDetails />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/dashboard/admin/nutritionists" element={<AdminNuts/>} />
          <Route path="/dashboard/admin/clients" element={<AdminClients/>} />
          <Route path="/dashboard/admin/settings" element={<AdminSettings/>} />
          <Route path="/dashboard/nutritionist/clients" element={<NutClients/>} />
          <Route path="/dashboard/nutritionist/profile" element={<NutProfile/>} />
          <Route path="/dashboard/nutritionist/settings" element={<NutSettings/>} />
          <Route path="/dashboard/client/profile" element={<ClientProfile/>} />
          <Route path="/dashboard/client/nutritionist" element={<ClientNut/>} />
          <Route path="/dashboard/client/settings" element={<ClientSettings/>} />
          <Route path="/dashboard/nutritionist" element={<NutritionistDashboard />} />
          <Route path="/dashboard/client" element={<ClientDashboard />} />
          <Route
            path="/dashboard"
            element={
              <Navigate
                to="/login"
                replace
              />
            }
          />

          {/* Catch all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;



// ALl routes with protected routes jwt-based...................

// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// import Landing from "./pages/Landing";
// import Login from "./pages/Login";
// import AdminDashboard from "./pages/dashboard/AdminDashboard";
// import NutritionistDashboard from "./pages/dashboard/NutritionistDashboard";
// import ClientDashboard from "./pages/dashboard/ClientDashboard";
// import NotFound from "./pages/NotFound";
// import Signup from "./pages/SignUp";

// import ProtectedRoute from "@/components/common/protectRoute"; 

// const queryClient = new QueryClient();

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <TooltipProvider>
//       <Toaster />
//       <Sonner />
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<Landing />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />

//           <Route path="/dashboard" element={<ProtectedRoute />}>
//             <Route path="admin" element={<AdminDashboard />} />
//             <Route path="nutritionist" element={<NutritionistDashboard />} />
//             <Route path="client" element={<ClientDashboard />} />
//           </Route>

//           <Route path="/dashboard" element={<Navigate to="/login" replace />} />

//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </BrowserRouter>
//     </TooltipProvider>
//   </QueryClientProvider>
// );

// export default App;

