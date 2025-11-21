
'use client';

import { useEffect, useState, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser, useAuth } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MailCheck, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { onAuthStateChanged, sendEmailVerification, User } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

function VerifyEmailContent() {
  const { user: initialUser, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const emailFromQuery = searchParams.get('email');

  // Function to handle redirection after successful verification
  const handleVerificationRedirect = useCallback(async (currentUser: User) => {
    if (isVerifying) return;
    setIsVerifying(true);
    try {
      // Force token refresh to get the latest user data
      await currentUser.getIdToken(true);
      // Redirect to the tree form page
      router.push('/tree-form');
    } catch (error) {
      console.error("Error refreshing token after verification:", error);
      toast({
        variant: 'destructive',
        title: 'Redirect Failed',
        description: 'Could not log you in automatically. Please try logging in manually.',
      });
      router.push('/login');
    }
  }, [isVerifying, router, toast]);

  // Handle cooldown timer for resend button
  useEffect(() => {
    let cooldownInterval: NodeJS.Timeout;
    if (cooldown > 0) {
      cooldownInterval = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(cooldownInterval);
  }, [cooldown]);

  // Main effect to handle verification status changes
  useEffect(() => {
    if (isUserLoading || isVerifying) return;

    // Check for localStorage verification flag immediately
    const checkLocalStorageVerification = () => {
      const verifiedFlag = localStorage.getItem('email_verified');
      const timestamp = localStorage.getItem('email_verified_timestamp');

      // Check if verification was set recently (within last 30 seconds)
      if (verifiedFlag === 'true' && timestamp) {
        const timeDiff = Date.now() - parseInt(timestamp);
        if (timeDiff < 30000) { // 30 seconds
          // Clear the flags
          localStorage.removeItem('email_verified');
          localStorage.removeItem('email_verified_timestamp');

          // Reload current user and redirect
          const currentUser = auth.currentUser;
          if (currentUser) {
            currentUser.reload().then(() => {
              if (currentUser.emailVerified) {
                handleVerificationRedirect(currentUser);
              }
            });
          }
          return true;
        }
      }
      return false;
    };

    // Check immediately on mount
    if (checkLocalStorageVerification()) {
      return;
    }

    // If user is already verified, redirect immediately
    if (initialUser?.emailVerified) {
      handleVerificationRedirect(initialUser);
      return;
    }

    // Set up listener for localStorage changes (from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'email_verified' && e.newValue === 'true') {
        checkLocalStorageVerification();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Set up listener for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser && currentUser.emailVerified) {
        // User is now verified, redirect them
        handleVerificationRedirect(currentUser);
      } else if (!currentUser) {
        // User session expired, show error and redirect to login
        setIsSessionExpired(true);
      }
    });

    // Set up an interval to periodically check if the user's email is verified
    const intervalId = setInterval(async () => {
      if (isSessionExpired || isVerifying) {
        clearInterval(intervalId);
        return;
      }

      // Check localStorage first (faster than reloading user)
      if (checkLocalStorageVerification()) {
        clearInterval(intervalId);
        return;
      }

      const currentUser = auth.currentUser;
      if (currentUser && !currentUser.emailVerified) {
        try {
          // Reload user data to get the latest emailVerified status.
          // The onAuthStateChanged listener above will then detect the change and handle the redirect.
          await currentUser.reload();
        } catch (error: any) {
          if (error.code === 'auth/user-token-expired') {
            clearInterval(intervalId);
            setIsSessionExpired(true);
          }
        }
      } else if (auth.currentUser?.emailVerified) {
        // Fallback check in case onAuthStateChanged is delayed
        handleVerificationRedirect(auth.currentUser);
      }
    }, 3000); // Check every 3 seconds (reduced from 8 seconds)

    // Cleanup function to remove listeners and intervals
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      unsubscribe();
      clearInterval(intervalId);
    };
  }, [initialUser, auth, router, isUserLoading, isVerifying, isSessionExpired, handleVerificationRedirect]);

  // Effect to handle session expiration
  useEffect(() => {
    if (isSessionExpired) {
      toast({
        variant: 'destructive',
        title: 'Session Expired',
        description: 'Your verification session has expired. Please sign in to continue.',
      });
      router.push('/login');
    }
  }, [isSessionExpired, router, toast]);

  // Function to resend verification email
  const handleResendClick = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'User session not found. Please sign in again.',
      });
      router.push('/login');
      return;
    }

    setIsResending(true);
    setCooldown(20); // Start 20-second cooldown immediately

    try {
      await sendEmailVerification(currentUser);
      toast({
        title: 'Verification Email Sent',
        description: 'A new verification link has been sent to your inbox.',
      });
    } catch (error: any) {
      if (error.code === 'auth/too-many-requests') {
        toast({
          variant: 'destructive',
          title: 'Too Many Requests',
          description: 'You have requested this too many times. Please wait a few minutes before trying again.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Failed to Resend',
          description: error.message || 'An error occurred. Please try again.',
        });
      }
    } finally {
      setIsResending(false);
    }
  };

  // Show loading state while initializing
  if (isUserLoading && !initialUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="ml-2">Initializing...</p>
      </div>
    );
  }

  // Show success state while redirecting
  if (isVerifying) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto bg-primary/10 p-3 rounded-full">
              <CheckCircle className="w-12 h-12 text-primary" />
            </div>
            <CardTitle className="mt-4">Success!</CardTitle>
            <CardDescription>
              Your email has been verified. Redirecting you...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Loader2 className="w-8 h-8 mx-auto animate-spin" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show main verification page
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 p-3 rounded-full">
            <MailCheck className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="mt-4">Verify Your Email</CardTitle>
          <CardDescription>
            We've sent a verification link to {emailFromQuery ? <strong>{emailFromQuery}</strong> : 'your email address'}. Please click the link to activate your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This page will automatically detect when you verify your email.
          </p>

          <Button variant="secondary" className="w-full" onClick={handleResendClick} disabled={isResending || cooldown > 0}>
            {isResending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Verification Email'}
          </Button>

          <p className="text-xs text-muted-foreground">
            If you've already verified, the page should refresh automatically. If not, please <button onClick={() => window.location.reload()} className="font-medium text-primary hover:underline">click here to refresh</button>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
