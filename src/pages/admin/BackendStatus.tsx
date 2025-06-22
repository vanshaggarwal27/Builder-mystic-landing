import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, RefreshCw, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function BackendStatus() {
  const [status, setStatus] = useState<
    "checking" | "connected" | "disconnected"
  >("checking");
  const [backendInfo, setBackendInfo] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkBackendStatus = async () => {
    setIsChecking(true);
    try {
      const response = await fetch(
        "https://shkva-backend-new.onrender.com/api/health",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setStatus("connected");
        setBackendInfo(data);
      } else {
        setStatus("disconnected");
        setBackendInfo(null);
      }
    } catch (error) {
      console.error("Backend check failed:", error);
      setStatus("disconnected");
      setBackendInfo(null);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkBackendStatus();
  }, []);

  return (
    <Card className="p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">Backend Status</h3>
        <Button
          onClick={checkBackendStatus}
          disabled={isChecking}
          variant="outline"
          size="sm"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isChecking ? "animate-spin" : ""}`}
          />
          Check
        </Button>
      </div>

      <div className="flex items-center space-x-3">
        {status === "checking" && (
          <>
            <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />
            <span className="text-blue-600">Checking connection...</span>
          </>
        )}

        {status === "connected" && (
          <>
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-green-600">Backend Connected</span>
            <Badge className="bg-green-100 text-green-700">Online</Badge>
          </>
        )}

        {status === "disconnected" && (
          <>
            <XCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-600">Backend Disconnected</span>
            <Badge className="bg-red-100 text-red-700">Offline</Badge>
          </>
        )}
      </div>

      {backendInfo && (
        <div className="mt-3 text-sm text-gray-600">
          <p>Server: {backendInfo.server}</p>
          <p>Database: {backendInfo.database}</p>
          <p>Last checked: {new Date().toLocaleTimeString()}</p>
        </div>
      )}

      {status === "disconnected" && (
        <div className="mt-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
          <p className="text-sm text-red-700">
            <strong>Backend not accessible.</strong> User creation requires
            backend connection. You're currently in offline mode - you can only
            view data, not create new users.
          </p>
        </div>
      )}
    </Card>
  );
}
