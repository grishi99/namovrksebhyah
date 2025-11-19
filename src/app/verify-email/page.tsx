
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser, useAuth } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MailCheck, Loader2, CheckCircle } from 'lucide-react';
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
  const emailFromQuery = searchParams.get('email');

  useEffect(() => {
    if (isVerifying) return;

    const handleVerification = (currentUser: User | null) => {
      if (currentUser && currentUser.emailVerified && !isVerifying) {
        setIsVerifying(true);
        // Force refresh the token to get the latest claims, then redirect.
        currentUser.getIdToken(true).then(() => {
          router.push('/tree-form');
        });
      }
    };

    if (user && user.emailVerified) {
      handleVerification(user);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, handleVerification);

    const intervalId = setInterval(async () => {
      if (auth.currentUser && !auth.currentUser.emailVerified && !isVerifying) {
        await auth.currentUser.reload();
        // The onAuthStateChanged listener will handle the redirect if status changes
      }
    }, 3000); 

    return () => {
      unsubscribe();
      clearInterval(intervalId);
    };
  }, [user, auth, router, isVerifying]);

  const handleResendClick = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not find user information. Please try signing up again.',
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
              Your email has been verified. Redirecting you to the form...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Loader2 className="w-8 h-8 mx-auto animate-spin" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (user && user.emailVerified && !isVerifying) {
     // This block handles the case where the user is already verified when they land on the page.
     // It triggers the verification logic immediately.
     useEffect(() => {
        setIsVerifying(true);
        user.getIdToken(true).then(() => {
          router.push('/tree-form');
        });
     }, [user, router]);

     // Render loading state while redirecting
     return (
        <div className="flex items-center justify-center min-h-screen bg-background">
          <Loader2 className="w-8 h-8 animate-spin" />
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
            This page will automatically redirect after you verify. If you didn't receive an email, you can request a new one.
          </p>
          
          <Button variant="secondary" className="w-full" onClick={handleResendClick}>
            Resend Verification Email
          </Button>
          
          <p className="text-xs text-muted-foreground">
            Already verified? The page should refresh automatically. If not, please <button onClick={() => window.location.reload()} className="font-medium text-primary hover:underline">click here to refresh</button>.
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
