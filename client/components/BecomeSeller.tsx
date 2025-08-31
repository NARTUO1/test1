import { useEffect } from "react";

export default function BecomeSeller() {
  useEffect(() => {
    // Redirect to register page with seller type
    window.location.href = "/register?type=seller";
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">
          Redirecting to seller registration...
        </p>
      </div>
    </div>
  );
}
