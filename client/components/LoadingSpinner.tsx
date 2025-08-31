import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  text,
  className = "",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Loader2 className={`animate-spin ${sizeClasses[size]}`} />
      {text && <span className="text-muted-foreground">{text}</span>}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center space-y-4 animate-fade-in">
        <div className="mx-auto">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Loading...</h3>
          <p className="text-muted-foreground">
            Please wait while we load your content
          </p>
        </div>
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="p-6 space-y-4 animate-pulse">
      <div className="skeleton h-4 w-3/4"></div>
      <div className="skeleton h-4 w-1/2"></div>
      <div className="skeleton h-20 w-full"></div>
      <div className="flex space-x-2">
        <div className="skeleton h-8 w-16"></div>
        <div className="skeleton h-8 w-16"></div>
      </div>
    </div>
  );
}
