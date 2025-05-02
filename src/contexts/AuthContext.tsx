import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Session, User, SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch initial session
    const fetchSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error fetching initial session:", error);
          toast({
            title: "Session Error",
            description: "Failed to load session. Please try again.",
            variant: "destructive",
          });
        }
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Unexpected error fetching session:", error);
        toast({
          title: "Unexpected Error",
          description: "An error occurred while loading session.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth event:", event, "Session:", session);
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    fetchSession();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        toast({
          title: "Login Failed",
          description: error.message || "Invalid email or password.",
          variant: "destructive",
        });
        return false;
      }

      setSession(data.session);
      setUser(data.user);
      toast({
        title: "Login Successful",
        description: "You have been logged in successfully.",
      });
      return true;
    } catch (error) {
      console.error("Unexpected login error:", error);
      toast({
        title: "Login Error",
        description: "An unexpected error occurred during login.",
        variant: "destructive",
      });
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        console.error("Registration error:", error);
        toast({
          title: "Registration Failed",
          description: error.message || "Could not register user.",
          variant: "destructive",
        });
        return false;
      }

      if (data.user) {
        setUser(data.user);
        setSession(data.session);
        toast({
          title: "Registration Successful",
          description: "Please check your email to confirm your account.",
        });
      }
      return true;
    } catch (error) {
      console.error("Unexpected registration error:", error);
      toast({
        title: "Registration Error",
        description: "An unexpected error occurred during registration.",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
        toast({
          title: "Logout Failed",
          description: error.message || "Could not log out.",
          variant: "destructive",
        });
        return;
      }
      setSession(null);
      setUser(null);
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully.",
      });
    } catch (error) {
      console.error("Unexpected logout error:", error);
      toast({
        title: "Logout Error",
        description: "An unexpected error occurred during logout.",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, login, logout, register }}>
      {isLoading ? null : children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}