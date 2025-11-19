
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MailCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { sendEmailVerification } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

export default function VerifyEmailPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (user && user.emailVerified) {
      router.push('/tree-form');
    }

    const intervalId = setInterval(async () => {
      if (user) {
        await user.reload();
        if (user.emailVerified) {
          router.push('/tree-form');
        }
      }
    }, 5000); 

    return () => clearInterval(intervalId);
  }, [user, router]);
  
  const handleResendVerification = async () => {
      if (!user) {
          toast({
              variant: 'destructive',
              title: 'Not Logged In',
              description: 'You need to be logged in to resend a verification email.',
          });
          return;
      }
      setIsResending(true);
      try {
          await sendEmailVerification(user);
          toast({
              title: 'Verification Email Sent',
              description: 'A new verification link has been sent to your email address.',
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
      </div>
    );
  }

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


  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 p-3 rounded-full">
            <MailCheck className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="mt-4">Verify Your Email</CardTitle>
          <CardDescription>
            We've sent a verification link to your email address. Please click the link to activate your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            If you've already verified, please refresh this page or click the link below. This page will auto-redirect upon successful verification.
          </p>
           <Button onClick={handleResendVerification} variant="secondary" className="w-full" disabled={isResending}>
            {isResending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Resending...</> : 'Resend Verification Email'}
          </Button>
           <Link href="/login" className="mt-6 inline-block w-full text-center text-sm text-primary hover:underline">
            Already verified? Continue to Form
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
