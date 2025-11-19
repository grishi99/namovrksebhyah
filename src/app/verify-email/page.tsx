
'use client';

import { useEffect, useState, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser, useAuth } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MailCheck, Loader2, CheckCircle, MailWarning } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { onAuthStateChanged, sendEmailVerification, User } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

function VerifyEmailContent() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const emailFromQuery = searchParams.get('email');

  const handleVerificationRedirect = useCallback(async (currentUser: User) => {
    if (isVerifying) return;
    setIsVerifying(true);
    try {
      await currentUser.getIdToken(true);
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

  useEffect(() => {
    if (isUserLoading) return;

    if (user && user.emailVerified) {
      handleVerificationRedirect(user);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.emailVerified) {
        handleVerificationRedirect(currentUser);
      }
    });

    const intervalId = setInterval(async () => {
      if (auth.currentUser && !auth.currentUser.emailVerified) {
        try {
          await auth.currentUser.reload();
        } catch (error: any) {
          if (error.code === 'auth/user-token-expired') {
            clearInterval(intervalId); // Stop polling
            await auth.signOut();
            toast({
              variant: 'destructive',
              title: 'Session Expired',
              description: 'Your session has expired. Please log in again to continue.',
            });
            router.push('/login');
          }
        }
      }
    }, 3000);

    return () => {
      unsubscribe();
      clearInterval(intervalId);
    };
  }, [user, auth, router, isUserLoading, handleVerificationRedirect]);

  const handleResendClick = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not find user information. Please sign up or log in again.',
      });
      return;
    }

    setIsResending(true);
    try {
      await sendEmailVerification(currentUser);
      toast({
        title: 'Verification Email Sent',
        description: 'A new verification link has been sent to your inbox.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to Resend',
        description: error.message || 'An error occurred. Please try again.',
      });
    } finally {
      setIsResending(false);
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="ml-2">Initializing...</p>
      </div>
    );
  }

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
            This page will automatically refresh after you verify.
          </p>
          
          <Button variant="secondary" className="w-full" onClick={handleResendClick} disabled={isResending}>
            {isResending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Resend Verification Email
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
    )
}
