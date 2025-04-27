
import { createContext, useContext, useState, ReactNode } from "react";
import { mockUsers } from "../data/mockData";

interface AuthContextType {
  user: { id: string; name: string; email: string } | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (name: string, email: string, password: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null);

  const login = (email: string, password: string) => {
    const foundUser = mockUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const register = (name: string, email: string, password: string) => {
    const existingUser = mockUsers.find((u) => u.email === email);
    if (existingUser) {
      return false;
    }
    
    // In a real app, this would involve API calls to create a user
    const newUser = {
      id: String(mockUsers.length + 1),
      name,
      email,
      password,
    };
    
    mockUsers.push(newUser);
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
