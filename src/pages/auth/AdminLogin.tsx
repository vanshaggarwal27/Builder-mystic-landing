import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, User, Lock, Shield, AlertTriangle } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // For admin login, we expect a security code (demo: any 6 digits)
    if (!securityCode || securityCode.length !== 6) {
      toast({
        title: "Security Code Required",
        description: "Please enter a 6-digit security code (e.g., 123456)",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log("🔐 Admin login attempt:", {
        email,
        securityCode: securityCode.length,
      });
      await login(email, password, "admin");
      console.log("✅ Admin login successful, navigating...");
      navigate("/admin/dashboard");
    } catch (error: any) {
      console.error("❌ Admin login failed:", error);
      toast({
        title: "Login Failed",
        description:
          error.message ||
          "Invalid email or password. Please contact your system administrator.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MobileLayout headerGradient="from-purple-600 to-blue-600">
      <div className="px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="h-8 w-8 text-purple-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h1>
          <p className="text-gray-600">Secure access to SHKVA</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Admin Email</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="Enter your admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-4 pr-12"
              />
              <User className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-4 pr-12"
              />
              <Lock className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="securityCode">Security Code</Label>
            <div className="relative">
              <Input
                id="securityCode"
                type="text"
                placeholder="Enter 6-digit security code"
                value={securityCode}
                onChange={(e) => setSecurityCode(e.target.value)}
                maxLength={6}
                className="pl-4 pr-12"
              />
              <Shield className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label htmlFor="remember" className="text-sm text-gray-600">
                Remember me
              </Label>
            </div>
            <Button variant="link" className="text-sm text-purple-600 p-0">
              Forgot Password?
            </Button>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Secure Login"}
          </Button>
        </form>

        {/* Security Notice */}
        <Alert className="mt-6 border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Security Notice</strong>
            <br />
            Admin access is monitored and logged for security purposes.
          </AlertDescription>
        </Alert>

        {/* Demo hint */}
        <div className="mt-4 p-4 bg-purple-50 rounded-lg">
          <p className="text-sm text-purple-700 text-center">
            <strong>Demo:</strong> admin@shkva.edu / admin123 / any 6 digits
          </p>
        </div>
      </div>
    </MobileLayout>
  );
}
