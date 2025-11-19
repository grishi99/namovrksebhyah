
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MailCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { sendEmailVerification, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function VerifyEmailPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isResending, setIsResending] = useState(false);
  const [showResendDialog, setShowResendDialog] = useState(false);
  const [resendEmail, setResendEmail] = useState('');
  const [resendPassword, setResendPassword] = useState('');

  useEffect(() => {
    if (user && user.emailVerified) {
      router.push('/tree-form');
    }

    const intervalId = setInterval(async () => {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
          // Manually refetch the user state from our hook
          // This isn't ideal but forces a re-check if the hook is stale
          const recheckUser = useUser.getState().user;
          if (recheckUser && recheckUser.emailVerified) {
             router.push('/tree-form');
          }
        }
      }
    }, 5000); 

    return () => clearInterval(intervalId);
  }, [user, router, auth]);
  
  const handleResendVerification = async () => {
      if (!resendEmail || !resendPassword) {
           toast({
              variant: 'destructive',
              title: 'Missing Information',
              description: 'Please enter your email and password to resend the verification link.',
          });
          return;
      }
      setIsResending(true);
      try {
          const userCredential = await signInWithEmailAndPassword(auth, resendEmail, resendPassword);
          if (userCredential.user && !userCredential.user.emailVerified) {
              await sendEmailVerification(userCredential.user);
              toast({
                  title: 'Verification Email Sent',
                  description: 'A new verification link has been sent to your email address.',
              });
              await signOut(auth); // Immediately sign out the unverified user
              setShowResendDialog(false);
          } else {
               toast({
                  title: 'Already Verified',
                  description: 'This account is already verified. You can log in.',
              });
              await signOut(auth);
          }
      } catch (error: any) {
          toast({
              variant: 'destructive',
              title: 'Failed to Resend',
              description: error.message || 'An error occurred. Please check your credentials and try again.',
          });
      } finally {
          setIsResending(false);
          setResendEmail('');
          setResendPassword('');
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
    <>
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
            <Button onClick={() => setShowResendDialog(true)} variant="secondary" className="w-full" disabled={isResending}>
              Resend Verification Email
            </Button>
            <Link href="/login" className="mt-6 inline-block w-full text-center text-sm text-primary hover:underline">
              Already verified? Continue to Form
            </Link>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showResendDialog} onOpenChange={setShowResendDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resend Verification Email</DialogTitle>
            <DialogDescription>
              To resend the verification link, please confirm your email and password.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="resend-email" className="text-right">
                Email
              </Label>
              <Input
                id="resend-email"
                type="email"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="resend-password" className="text-right">
                Password
              </Label>
              <Input
                id="resend-password"
                type="password"
                value={resendPassword}
                onChange={(e) => setResendPassword(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary">Cancel</Button>
            </DialogClose>
            <Button onClick={handleResendVerification} disabled={isResending}>
              {isResending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Sending...</> : 'Send Email'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
