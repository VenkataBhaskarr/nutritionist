
import React, { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  LogOut,
  User,
  Menu,
  ArrowLeft,
  Settings,
  MessageCircleMore,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  userRole: "admin" | "nutritionist" | "client";
}

const DashboardLayout = ({ children, title, userRole }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const getNavItems = () => {
    switch(userRole) {
      case "admin":
        return [
          { icon: LayoutDashboard, name: "Dashboard", path: "/dashboard/admin" },
          { icon: Users, name: "Nutritionists", path: "/dashboard/admin/nutritionists" },
          { icon: Users, name: "Clients", path: "/dashboard/admin/clients" },
          { icon: Settings, name: "Settings", path: "/dashboard/admin/settings" }
        ];
      case "nutritionist":
        return [
          { icon: LayoutDashboard, name: "Dashboard", path: "/dashboard/nutritionist" },
          { icon: Users, name: "My Clients", path: "/dashboard/nutritionist/clients" },
          { icon: User, name: "Profile", path: "/dashboard/nutritionist/profile" },
          { icon: MessageCircleMore, name: "Messages", path: "/dashboard/nutritionist/messages" }
        ];
      case "client":
        return [
          { icon: LayoutDashboard, name: "Dashboard", path: "/dashboard/client" },
          { icon: User, name: "My Profile", path: "/dashboard/client/profile" },
          { icon: User, name: "My Nutritionist", path: "/dashboard/client/nutritionist" },
          { icon: MessageCircleMore, name: "Messages", path: "/dashboard/client/messages" }
        ];
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-30 transition-all duration-300",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="h-full flex flex-col">
          <div className={cn(
            "h-16 border-b border-gray-200 flex items-center px-4",
            isSidebarOpen ? "justify-between" : "justify-center"
          )}>
            {isSidebarOpen && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
                  <span className="text-white font-bold">N</span>
                </div>
                <span className="text-l font-extrabold">Livin Significant</span>
              </div>
            )}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              {isSidebarOpen ? <ArrowLeft size={18} /> : <Menu size={18} />}
            </button>
          </div>
          
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {getNavItems().map((item, index) => (
                <li key={index}>
                  <Button 
                    variant="ghost" 
                    className={cn(
                      "w-full justify-start",
                      !isSidebarOpen && "justify-center"
                    )}
                    onClick={() => navigate(item.path)}
                  >
                    <item.icon className={cn(
                      "mr-2 h-5 w-5",
                      !isSidebarOpen && "mr-0"
                    )} />
                    {isSidebarOpen && <span>{item.name}</span>}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="p-4 border-t border-gray-200">
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50",
                !isSidebarOpen && "justify-center"
              )}
              onClick={handleLogout}
            >
              <LogOut className={cn(
                "mr-2 h-5 w-5",
                !isSidebarOpen && "mr-0"
              )} />
              {isSidebarOpen && <span>Logout</span>}
            </Button>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className={cn(
        "flex-1 transition-all duration-300",
        isSidebarOpen ? "ml-64" : "ml-20"
      )}>
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <h1 className="text-xl font-bold">{title}</h1>
          <div className="flex items-center space-x-2">
            <div className="flex flex-col items-end">
              <span className="font-medium">
                {userRole === "admin" ? "Administrator" : 
                 userRole === "nutritionist" ? "Nutritionist" : "Client"}
              </span>
              <span className="text-xs text-gray-500">
                {userRole === "admin" ? "admin@example.com" : 
                 userRole === "nutritionist" ? "nutritionist@example.com" : "client@example.com"}
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <User className="h-5 w-5 text-primary-500" />
            </div>
          </div>
        </header>
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
