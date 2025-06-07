import React, { ReactNode, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  LogOut,
  User,
  ArrowRight,
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const savedState = localStorage.getItem("sidebarOpen");
    return savedState ? JSON.parse(savedState) : true;
  });
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  const getNavItems = () => {
    switch (userRole) {
      case "admin":
        return [
          { icon: LayoutDashboard, name: "Dashboard", path: "/dashboard/admin" },
          { icon: Users, name: "Nutritionists", path: "/dashboard/admin/nutritionists" },
          { icon: Users, name: "Clients", path: "/dashboard/admin/clients" },
          { icon: Settings, name: "Settings", path: "/dashboard/admin/settings" },
        ];
      case "nutritionist":
        return [
          { icon: LayoutDashboard, name: "Appointments", path: "/dashboard/nutritionist" },
          { icon: Users, name: "My Clients", path: "/dashboard/nutritionist/clients" },
          { icon: User, name: "Profile", path: "/dashboard/nutritionist/profile" },
          { icon: MessageCircleMore, name: "Messages", path: "/dashboard/nutritionist/messages" },
        ];
      case "client":
        return [
          { icon: LayoutDashboard, name: "Dashboard", path: "/dashboard/client" },
          { icon: User, name: "My Profile", path: "/dashboard/client/profile" },
          { icon: User, name: "My Nutritionist", path: "/dashboard/client/nutritionist" },
          { icon: MessageCircleMore, name: "Messages", path: "/dashboard/client/messages" },
        ];
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("sidebarOpen");
    navigate("/login");
  };

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-30",
          // On mobile (below md), always collapsed (w-14), no transition; on desktop (md and above), toggle with transition
          "w-14 md:w-64 md:transition-all md:duration-300",
          { "md:w-14": !isSidebarOpen } // Only apply toggle width on desktop
        )}
      >
        <div className="h-full flex flex-col">
          <div
            className={cn(
              "h-16 border-b border-gray-200 flex items-center px-3",
              // On mobile, always center the logo; on desktop, adjust based on sidebar state
              "justify-center md:justify-between"
            )}
          >
            {/* Logo always visible on mobile, conditionally visible on desktop */}
            <div className="flex items-center space-x-2">
               <div className="w-8 h-8 rounded-full flex items-center justify-center">
                <span className="font-bold">
                  <img src="logo.png" alt="Livin Significant Logo" />
                </span>
              </div>
              {/* Show "Livin Significant" text only on desktop when sidebar is open */}
              {isSidebarOpen && (
                <span className="text-lg font-extrabold hidden md:inline">Livin Significant</span>
              )}
            </div>

            {/* Show toggle button only on desktop (md and above) */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md hover:bg-gray-100 hidden md:block"
            >
              {isSidebarOpen ? (
                <ArrowLeft className="w-5 h-5" />
              ) : (
                <ArrowRight className="w-5 h-5" />
              )}
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-1">
              {getNavItems().map((item, index) => (
                <li key={index}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full",
                      // On mobile, always center (icons only); on desktop, adjust based on sidebar state
                      "justify-center md:justify-start",
                      "text-gray-700 hover:text-primary-500 hover:bg-gray-100 py-2"
                    )}
                    onClick={() => handleNavClick(item.path)}
                    title={isSidebarOpen ? undefined : item.name}
                  >
                    <item.icon
                      className={cn(
                        "h-5 w-5",
                        // On mobile, no margin (icons only); on desktop, add margin when sidebar is open
                        "md:mr-2",
                        { "md:mr-0": !isSidebarOpen }
                      )}
                    />
                    {/* Show text only on desktop when sidebar is open */}
                    {isSidebarOpen && <span className="hidden md:inline">{item.name}</span>}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-3 border-t border-gray-200">
            <Button
              variant="ghost"
              className={cn(
                "w-full",
                // On mobile, center (icon only); on desktop, adjust based on sidebar state
                "justify-center md:justify-start",
                "text-red-500 hover:text-red-600 hover:bg-red-50 py-2"
              )}
              onClick={handleLogout}
              title={isSidebarOpen ? undefined : "Logout"}
            >
              <LogOut
                className={cn(
                  "h-5 w-5",
                  // On mobile, no margin (icon only); on desktop, add margin when sidebar is open
                  "md:mr-2",
                  { "md:mr-0": !isSidebarOpen }
                )}
              />
              {/* Show text only on desktop when sidebar is open */}
              {isSidebarOpen && <span className="hidden md:inline">Logout</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={cn(
          "flex-1 transition-all duration-300",
          // On mobile, always offset by collapsed sidebar (w-14);	On desktop, adjust based on sidebar state
          "ml-14 md:ml-64",
          { "md:ml-14": !isSidebarOpen }
        )}
      >
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <h1 className="text-xl font-bold">{title}</h1>
          <div className="flex items-center space-x-2">
            <div className="flex flex-col items-end">
              <span className="font-medium">
                {userRole === "admin"
                  ? "Administrator"
                  : userRole === "nutritionist"
                  ? "Nutritionist"
                  : "Client"}
              </span>
              <span className="text-xs text-gray-500">
                {userRole === "admin"
                  ? "admin@example.com"
                  : userRole === "nutritionist"
                  ? "nutritionist@example.com"
                  : "client@example.com"}
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <User className="h-5 w-5 text-primary-500" />
            </div>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;