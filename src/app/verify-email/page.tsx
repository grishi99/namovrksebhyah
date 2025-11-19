
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser, useAuth } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MailCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { onAuthStateChanged, sendEmailVerification } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

function VerifyEmailContent() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const emailFromQuery = searchParams.get('email');

  useEffect(() => {
    if (user && user.emailVerified) {
      router.push('/tree-form');
      return;
    }

    // Set up a real-time listener for auth state changes.
    // This is the primary mechanism for detecting verification.
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.emailVerified) {
        router.push('/tree-form');
      }
    });

    // Also set up an interval to periodically reload the user state.
    // This acts as a reliable fallback.
    const intervalId = setInterval(async () => {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
          router.push('/tree-form');
        }
      }
    }, 3000); // Check every 3 seconds

    // Cleanup function to remove the listener and interval when the component unmounts.
    return () => {
      unsubscribe();
      clearInterval(intervalId);
    };
  }, [user, auth, router]);

  const handleResendClick = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not find user. Please try signing up again.',
      });
      router.push('/signup');
      return;
    }
    try {
      await sendEmailVerification(user);
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
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // This case handles a user who is already verified and lands on this page.
  if (user && user.emailVerified) {
    return (
       <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
             <div className="mx-auto bg-primary/10 p-3 rounded-full">
                <MailCheck className="w-12 h-12 text-primary" />
            </div>
            <CardTitle className="mt-4">Email Verified!</CardTitle>
            <CardDescription>
              Your email has been successfully verified.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/tree-form')} className="w-full">
              Continue to Form
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // The main view for a user who needs to verify their email.
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
            This page will automatically redirect after you verify. If you didn't receive an email, you can request a new one.
          </p>
          
          <Button variant="secondary" className="w-full" onClick={handleResendClick}>
            Resend Verification Email
          </Button>
          
          <p className="text-xs text-muted-foreground">
            Already verified? <Link href="/login" className="font-medium text-primary hover:underline">Log in</Link> or refresh the page.
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
