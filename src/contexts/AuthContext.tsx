import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { User, UserRole } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Use production backend for real data
const API_BASE_URL = "https://shkva-backend-new.onrender.com/api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on app load and restore user session
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const savedUser = localStorage.getItem("currentUser");

    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        // Verify token with backend
        fetchCurrentUser(token);
      } catch (e) {
        console.error("Error parsing saved user:", e);
        localStorage.removeItem("authToken");
        localStorage.removeItem("currentUser");
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const userData = {
          id: data.user.id,
          name: `${data.user.profile.firstName} ${data.user.profile.lastName}`,
          email: data.user.email,
          role: data.user.role,
        };
        setUser(userData);
        localStorage.setItem("currentUser", JSON.stringify(userData));
      } else {
        // Token is invalid, remove it
        localStorage.removeItem("authToken");
        localStorage.removeItem("currentUser");
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
      localStorage.removeItem("authToken");
      localStorage.removeItem("currentUser");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string, role: UserRole) => {
    console.log("🔐 Login starting:", { email, role });
    console.log("🌐 Using API URL:", API_BASE_URL);

    // All users, including admin, use real backend authentication
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      });

      // Parse response body only once
      let data;
      try {
        // Use response.json() directly instead of text() then parse
        data = await response.json();
      } catch (parseError) {
        console.error("❌ JSON parse error:", parseError);
        // If JSON parsing fails, it might be a network issue or invalid response
        throw new Error(
          "Server returned invalid response. Please check your connection and try again.",
        );
      }

      if (!response.ok) {
        console.error("❌ Server response not ok:", {
          status: response.status,
          statusText: response.statusText,
          data: data,
        });

        // Handle specific error cases
        if (response.status === 401) {
          throw new Error(
            "Invalid email, password, or role. Please check your credentials.",
          );
        } else if (response.status >= 500) {
          throw new Error("Server error. Please try again later.");
        } else if (response.status === 404) {
          throw new Error("Login service not found. Please contact support.");
        }

        throw new Error(
          data?.error ||
            data?.message ||
            "Login failed. Please check your credentials and try again.",
        );
      }

      // Store token and user data
      localStorage.setItem("authToken", data.token);
      const userData = {
        id: data.user.id,
        name: `${data.user.profile.firstName} ${data.user.profile.lastName}`,
        email: data.user.email,
        role: data.user.role,
      };
      setUser(userData);
      localStorage.setItem("currentUser", JSON.stringify(userData));

      console.log("✅ Backend login completed successfully");
    } catch (error: any) {
      console.error("❌ Backend login failed:", error);

      // No fallback - use real backend only

      throw new Error(
        error.message || "Login failed. Please contact your admin.",
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated, loading }}
    >
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

// Helper function to get API headers with auth token
export function getAuthHeaders() {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// Helper function to make authenticated API calls
export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("authToken");

  // Handle demo admin token for offline scenarios
  if (token === "demo-admin-token") {
    // For demo admin, simulate API responses for essential operations
    if (endpoint === "/admin/users" && options.method === "GET") {
      return { users: [] }; // Return empty users list
    }
    if (endpoint === "/admin/users" && options.method === "POST") {
      throw new Error(
        "Please use real admin login to create users. Backend connection required.",
      );
    }
    throw new Error(
      "Backend connection required for this operation. Please ensure you're connected to the internet and try logging in again.",
    );
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const headers = getAuthHeaders();

  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  console.log(`API Call: ${options.method || "GET"} ${url}`, {
    status: response.status,
    statusText: response.statusText,
  });

  // Parse response text once
  const responseText = await response.text();
  let data;
  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch (parseError) {
    data = { error: responseText || "Invalid response" };
  }

  if (!response.ok) {
    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("authToken");
      localStorage.removeItem("currentUser");
      throw new Error("Session expired. Please login again.");
    }

    const errorMessage =
      data.error ||
      data.message ||
      responseText ||
      `API call failed: ${response.status}`;
    throw new Error(errorMessage);
  }

  return data;
}
