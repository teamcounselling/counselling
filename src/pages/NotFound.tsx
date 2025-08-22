import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <Card className="text-center p-12 max-w-md shadow-xl">
        <div className="text-6xl mb-6">🔍</div>
        <h1 className="text-4xl font-bold text-foreground mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Oops! The page you're looking for doesn't exist.
        </p>
        <div className="space-y-3">
          <Button variant="hero" size="lg" asChild>
            <a href="/">Return to Home</a>
          </Button>
          <div className="text-sm text-muted-foreground">
            Tried to access: <code className="bg-muted px-2 py-1 rounded">{location.pathname}</code>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;
