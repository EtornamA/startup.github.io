import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

export default function AuthPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { autoSignIn, user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in (e.g. mock session in localStorage)
  useEffect(() => {
    if (!loading && user) {
      navigate('/app', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleAutoSignIn = async () => {
    setIsSubmitting(true);
    const { error } = await autoSignIn();
    setIsSubmitting(false);
    if (!error) {
      navigate('/app', { replace: true });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-border">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto h-12 w-12 rounded-xl gradient-primary flex items-center justify-center">
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
            <CardDescription className="mt-2">
              Sign in to access your notes and classes
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <Button 
            onClick={handleAutoSignIn}
            className="w-full" 
            variant="glow"
            disabled={isSubmitting}
            size="lg"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In as John Adams'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
