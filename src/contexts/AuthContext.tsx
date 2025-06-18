import React, { createContext, useContext, useState, ReactNode } from "react";
import { User, UserRole } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: Record<string, User> = {
  "student@shkva.edu": {
    id: "STU2024001",
    name: "John Smith",
    email: "john.smith@shkva.edu",
    role: "student",
  },
  "teacher@shkva.edu": {
    id: "TCH2024001",
    name: "Ms. Johnson",
    email: "maria.johnson@shkva.edu",
    role: "teacher",
  },
  "admin@shkva.edu": {
    id: "ADM2024001",
    name: "Admin User",
    email: "admin@shkva.edu",
    role: "admin",
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string, role: UserRole) => {
    // Mock authentication - in real app, this would call an API
    const mockUser = mockUsers[email];
    if (mockUser && mockUser.role === role) {
      setUser(mockUser);
    } else {
      throw new Error("Invalid credentials");
    }
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
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
