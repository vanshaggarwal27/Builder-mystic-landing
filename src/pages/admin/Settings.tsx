import React from "react";
import { Star, Bell, Shield, Database, Palette, Globe } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export default function AdminSettings() {
  const settingsCategories = [
    {
      title: "System Settings",
      icon: Database,
      items: [
        { label: "Backup & Restore", description: "Manage system backups" },
        { label: "System Maintenance", description: "Schedule maintenance" },
        {
          label: "Database Management",
          description: "Monitor database health",
        },
      ],
    },
    {
      title: "User Management",
      icon: Shield,
      items: [
        { label: "User Permissions", description: "Manage role permissions" },
        { label: "Security Policies", description: "Set password policies" },
        { label: "Access Controls", description: "Configure access levels" },
      ],
    },
    {
      title: "Notifications",
      icon: Bell,
      items: [
        {
          label: "Email Notifications",
          description: "Configure email alerts",
          hasSwitch: true,
        },
        {
          label: "SMS Notifications",
          description: "Configure SMS alerts",
          hasSwitch: true,
        },
        {
          label: "Push Notifications",
          description: "Mobile push notifications",
          hasSwitch: true,
        },
      ],
    },
    {
      title: "Appearance",
      icon: Palette,
      items: [
        { label: "Theme Settings", description: "Customize app theme" },
        { label: "Logo & Branding", description: "Update school branding" },
        { label: "Color Scheme", description: "Adjust color preferences" },
      ],
    },
    {
      title: "Integration",
      icon: Globe,
      items: [
        { label: "API Settings", description: "Configure external APIs" },
        { label: "Third-party Apps", description: "Manage integrations" },
        { label: "Export Settings", description: "Data export preferences" },
      ],
    },
  ];

  return (
    <>
      <MobileLayout
        title="Settings"
        headerGradient="from-purple-600 to-blue-600"
        className="pb-20"
      >
        <div className="px-6 py-6">
          {/* Admin Info */}
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white p-6 rounded-2xl mb-6 -mt-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Star className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">System Settings</h2>
                <p className="text-white/80">SHKVA Administration</p>
              </div>
            </div>
          </div>

          {/* Settings Categories */}
          <div className="space-y-6">
            {settingsCategories.map((category, categoryIndex) => {
              const IconComponent = category.icon;
              return (
                <div key={categoryIndex}>
                  <div className="flex items-center gap-2 mb-3">
                    <IconComponent className="h-5 w-5 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {category.title}
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <Card key={itemIndex} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">
                              {item.label}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {item.description}
                            </p>
                          </div>
                          {item.hasSwitch ? (
                            <Switch defaultChecked />
                          ) : (
                            <Button variant="ghost" size="sm">
                              Configure
                            </Button>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* System Info */}
          <Card className="p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              System Information
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">SHKVA Version</span>
                <span className="font-medium">v2.4.1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Database Version</span>
                <span className="font-medium">PostgreSQL 14.2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Backup</span>
                <span className="font-medium">Today, 3:00 AM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">System Status</span>
                <span className="font-medium text-green-600">Healthy</span>
              </div>
            </div>
          </Card>
        </div>
      </MobileLayout>
      <BottomNavigation />
    </>
  );
}
