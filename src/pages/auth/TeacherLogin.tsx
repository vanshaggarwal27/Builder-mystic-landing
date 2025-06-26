import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCheck, User, Lock } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function TeacherLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent multiple concurrent login attempts
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password, "teacher");
      navigate("/teacher/dashboard");
    } catch (error) {
      toast({
        title: "Login Failed",
        description:
          "Invalid email or password. Please contact your admin if you need an account.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MobileLayout headerGradient="from-green-500 to-blue-600">
      <div className="px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCheck className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Teacher Login
          </h1>
          <p className="text-gray-600">Access your teaching portal</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
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
            <Button variant="link" className="text-sm text-green-600 p-0">
              Forgot Password?
            </Button>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login to Portal"}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Need help accessing your account?
          </p>
          <Button variant="link" className="text-green-600 p-0">
            Contact IT Support
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}
