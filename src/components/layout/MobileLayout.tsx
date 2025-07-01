import React, { ReactNode } from "react";
import { ArrowLeft, Menu, Star, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MobileLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  showMenu?: boolean;
  showStar?: boolean;
  showBell?: boolean;
  headerGradient?: string;
  onBack?: () => void;
  onMenu?: () => void;
  className?: string;
}

export function MobileLayout({
  children,
  title,
  subtitle,
  showBack = false,
  showMenu = false,
  showStar = false,
  showBell = false,
  headerGradient = "from-blue-500 to-purple-600",
  onBack,
  onMenu,
  className,
}: MobileLayoutProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={cn("min-h-screen bg-gray-50 flex flex-col", className)}>
      {/* Header */}
      {(title || showBack || showMenu || showStar || showBell) && (
        <div
          className={cn(
            "bg-gradient-to-br text-white px-4 pt-14 pb-6",
            headerGradient,
          )}
        >
          <div className="flex items-center justify-between mb-2">
            {showBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="text-white hover:bg-white/20 p-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}

            {showMenu && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMenu}
                className="text-white hover:bg-white/20 p-2"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}

            <div className="flex-1" />

            {showStar && (
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 p-2"
              >
                <Star className="h-5 w-5" />
              </Button>
            )}

            {showBell && (
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 p-2"
              >
                <Bell className="h-5 w-5" />
              </Button>
            )}
          </div>

          {title && (
            <div className="text-center">
              <h1 className="text-xl font-semibold">{title}</h1>
              {subtitle && (
                <p className="text-white/80 text-sm mt-1">{subtitle}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 relative pb-20">{children}</div>
    </div>
  );
}
