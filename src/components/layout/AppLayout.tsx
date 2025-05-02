
import { ReactNode, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  File, 
  Upload, 
  Shield,
  Lock,
  LogOut,
  Menu,
  X
} from "lucide-react";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-vault-light">
      {/* Mobile sidebar toggle */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-gradient-to-r from-blue-300 to-white shadow-md"
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </Button>
      </div>

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-vault-primary text-white transition-transform duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b border-vault-secondary">
            <Shield className="mr-2" size={24} />
            <h1 className="text-xl font-bold">Sentry Vault</h1>
          </div>

          {/* User info */}
          <div className="p-4 border-b border-vault-secondary">
            <p className="text-sm text-gray-300">Welcome,</p>
            <p className="font-medium">
              {user.user_metadata?.full_name || user.email || 'User'}
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-vault-secondary"
              onClick={() => navigate("/")}
            >
              <File className="mr-2" size={18} />
              Documents
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-vault-secondary"
              onClick={() => navigate("/upload")}
            >
              <Upload className="mr-2" size={18} />
              Upload
            </Button>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-vault-secondary">
            <Button
              variant="outline"
              className="w-full justify-start text-white border-white hover:bg-vault-secondary"
              onClick={handleLogout}
            >
              <LogOut className="mr-2" size={18} />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div 
        className={`flex-1 transition-all duration-200 ${
          sidebarOpen ? "md:ml-64" : "ml-0"
        }`}
      >
        <main className="p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
