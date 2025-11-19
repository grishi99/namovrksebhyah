
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

function VerifyEmailContent() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [isResending, setIsResending] = useState(false);

  const emailFromQuery = searchParams.get('email');

  useEffect(() => {
    if (user && user.emailVerified) {
      router.push('/tree-form');
    }

    const intervalId = setInterval(async () => {
      if (auth.currentUser) {
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
      if (!emailFromQuery) {
          toast({
              variant: 'destructive',
              title: 'Missing Email',
              description: 'Could not find the email to verify. Please try signing up again.',
          });
          return;
      }
      setIsResending(true);
      try {
        // We sign in with a fake password to get the user object if the email exists.
        const userCredential = await signInWithEmailAndPassword(auth, emailFromQuery, `invalid-password-${Date.now()}`);
        // This part should ideally not be reached if the password is fake. But if it does, handle it.
        if (userCredential.user && !userCredential.user.emailVerified) {
            await sendEmailVerification(userCredential.user);
            toast({
                title: 'Verification Email Sent',
                description: 'A new verification link has been sent to your email address.',
            });
            await signOut(auth);
        }
      } catch (error: any) {
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
            // This is the expected error. It means the user exists. We now need a valid user object.
            // We can't get it without a valid password. However, we can re-trigger the signup flow's logic.
            // A simple way is to just inform the user. A more complex way would be a custom backend function.
            // For now, let's try to get the user object differently if possible or just notify them.
            // The best approach here is to mimic the signup flow's catch block.
            try {
                // Let's re-create a temporary user object to send verification.
                // This is a workaround since we can't get the user object directly.
                // A better, more robust solution would involve a backend function.
                // Given the constraints, we will re-attempt the sign-in to get the user and then send the mail.
                // The previous logic was flawed because we can't just send an email without a user object.
                // The sign-up logic handles this correctly, let's replicate that.
                 toast({
                    title: 'Sending Email...',
                    description: 'Attempting to send a new verification link.',
                });
                // We don't have the password, so we can't sign in.
                // The premise of "just resend" without password is not directly supported by Firebase client SDK for security reasons.
                // Let's try a different approach from the signup form.
                // The logic from SignUpForm is what we need. When an email is in use, we re-sign-in and send.
                // Here, we don't have the password.
                // The most straightforward client-side solution is to tell the user what to do.
                // I will revert to the logic that works: re-attempting sign up, which will trigger the verification resend.

                // The user's request to "just resend" is in conflict with Firebase client-side security.
                // The most user-friendly approach that is still secure is to ask them to try signing up again.
                // This is not ideal. Let's try one more time to create a User object.
                // The only way is to have them log in. My previous attempts were correct in principle but flawed in UX.

                // Let's just try to send it. The user object might still be in the session from the initial signup.
                if (auth.currentUser && auth.currentUser.email === emailFromQuery && !auth.currentUser.emailVerified) {
                    await sendEmailVerification(auth.currentUser);
                     toast({
                        title: 'Verification Email Sent',
                        description: 'A new verification link has been sent to your email address.',
                    });
                } else {
                     // If we are here, it means we have no user object.
                     // The password dialog was the correct technical solution, but bad UX.
                     // A compromise: we can't resend it, so we guide them.
                      toast({
                        variant: 'destructive',
                        title: 'Could Not Resend Email',
                        description: 'Please try signing up again with the same email and password to receive a new verification link.',
                    });
                }


            } catch (resendError: any) {
                 toast({
                    variant: 'destructive',
                    title: 'Failed to Resend',
                    description: resendError.message || 'An error occurred. Please try signing up again.',
                });
            }

        } else {
             toast({
                variant: 'destructive',
                title: 'Failed to Resend',
                description: error.message || 'An unexpected error occurred.',
            });
        }
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
            <Button onClick={handleResendVerification} variant="secondary" className="w-full" disabled={isResending}>
               {isResending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Resending...</> : 'Resend Verification Email'}
            </Button>
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
