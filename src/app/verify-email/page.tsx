
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser, useAuth } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MailCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { sendEmailVerification, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


function VerifyEmailContent() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [isResending, setIsResending] = useState(false);
  const [password, setPassword] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const emailFromQuery = searchParams.get('email');

  useEffect(() => {
    if (user && user.emailVerified) {
      router.push('/tree-form');
    }

    const intervalId = setInterval(async () => {
      if (auth.currentUser && !auth.currentUser.emailVerified) {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
           router.push('/tree-form');
           clearInterval(intervalId);
        }
      }
    }, 5000); 

    return () => clearInterval(intervalId);
  }, [user, router, auth]);
  
  const handleResendVerification = async () => {
    if (!emailFromQuery || !password) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Password is required to resend verification.',
        });
        return;
    }
    setIsResending(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, emailFromQuery, password);
      
      if (userCredential.user && !userCredential.user.emailVerified) {
          await sendEmailVerification(userCredential.user);
          toast({
              title: 'Verification Email Sent',
              description: 'A new verification link has been sent to your email address.',
          });
      } else if (userCredential.user && userCredential.user.emailVerified) {
          toast({
            title: 'Already Verified',
            description: 'Your account is already verified. You will be redirected.',
          });
          router.push('/tree-form');
      }
      // Always sign out after this operation
      await signOut(auth);

    } catch (error: any) {
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        toast({
          variant: 'destructive',
          title: 'Authentication Failed',
          description: 'The password you entered was incorrect. Please try again.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Failed to Resend',
          description: error.message || 'An unexpected error occurred.',
        });
      }
    } finally {
        setIsResending(false);
        setPassword('');
        setIsDialogOpen(false);
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
              We've sent a verification link to {emailFromQuery ? <strong>{emailFromQuery}</strong> : 'your email address'}. Please click the link to activate your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              If you've already verified, this page will refresh automatically. You can also refresh the page manually.
            </p>

            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="secondary" className="w-full">
                  Resend Verification Email
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Enter Password to Resend</AlertDialogTitle>
                  <AlertDialogDescription>
                    For your security, please enter your password to resend the verification email to <strong>{emailFromQuery}</strong>.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setPassword('')}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleResendVerification} disabled={isResending || !password}>
                    {isResending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Resending...</> : 'Resend'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            <Link href="/login" className="mt-6 inline-block w-full text-center text-sm text-primary hover:underline">
              Already verified? Continue to Form
            </Link>
          </CardContent>
        </Card>
      </div>
    </>
  );
}


export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
            <VerifyEmailContent />
        </Suspense>
    )
}
