
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { DocumentProvider } from "./contexts/DocumentContext";
import AuthGuard from "./components/guards/AuthGuard";
import Index from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Upload from "./pages/Upload";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DocumentProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route 
                path="/" 
                element={
                  <AuthGuard>
                    <Index />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/upload" 
                element={
                  <AuthGuard>
                    <Upload />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/login" 
                element={
                  <AuthGuard requireAuth={false}>
                    <Login />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <AuthGuard requireAuth={false}>
                    <Register />
                  </AuthGuard>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </DocumentProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
