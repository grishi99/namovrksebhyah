'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth, initiateEmailSignUp } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useFirestore, setDocumentNonBlocking } from '@/firebase';
import { useRouter } from 'next/navigation';
import { sendEmailVerification, signInWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { signInWithGoogle } from '@/firebase/google-auth';
import { getDoc } from 'firebase/firestore';



const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'], // Set the error on the confirmPassword field
});

export function SignUpForm() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore) {
      toast({
        variant: 'destructive',
        title: 'Sign-up Failed',
        description: 'Database service is not available. Please try again later.',
      });
      return;
    }
    try {
      const userCredential = await initiateEmailSignUp(auth, values.email, values.password);
      const user = userCredential.user;

      if (user) {
        await sendEmailVerification(user);
        toast({
          title: "Verification Email Sent",
          description: "Please check your inbox to verify your email address.",
        });

        const userDocRef = doc(firestore, 'users', user.uid);
        setDocumentNonBlocking(userDocRef, {
          id: user.uid,
          email: values.email,
        }, { merge: true });

        // User is kept logged in and redirected
        router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
      }

    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        try {
          // Attempt to sign in to check if the user is verified
          const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
          if (userCredential.user && !userCredential.user.emailVerified) {
            // If they exist but are not verified, resend the email
            await sendEmailVerification(userCredential.user);
            toast({
              title: 'Verification Email Resent',
              description: 'This email is already registered. A new verification link has been sent to your inbox.',
            });
            // Redirect to verification page, keeping them logged in
            router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
          } else if (userCredential.user && userCredential.user.emailVerified) {
            // If they are already verified, they should log in instead
            toast({
              variant: 'destructive',
              title: 'Account Already Exists',
              description: 'This account is already verified. Please log in instead.',
            });
            await auth.signOut(); // Sign out before redirecting to login
            router.push('/login');
          }
        } catch (signInError: any) {
          // This catch block handles cases like incorrect password for an existing email
          toast({
            variant: 'destructive',
            title: 'Authentication Failed',
            description: 'An account with this email already exists, but the password provided was incorrect. Please try logging in or resetting your password.',
          });
        }
      } else {
        console.error('Sign up error', error);
        toast({
          variant: 'destructive',
          title: 'Sign-up Failed',
          description: error.message || 'An unexpected error occurred during sign-up.',
        });
      }
    }
  }


  async function handleGoogleSignUp() {
    if (!firestore) {
      toast({
        variant: 'destructive',
        title: 'Sign-up Failed',
        description: 'Database service is not available. Please try again later.',
      });
      return;
    }
    setIsGoogleLoading(true);
    try {
      const userCredential = await signInWithGoogle(auth);
      const user = userCredential.user;

      if (user) {
        // Check if user document exists
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          // Create user document if it doesn't exist
          await setDocumentNonBlocking(userDocRef, {
            id: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            createdAt: new Date(),
          }, { merge: true });
        }

        toast({
          title: "Sign-up Successful",
          description: "Welcome! You have successfully signed up with Google.",
        });
        router.push('/tree-form');
      }
    } catch (error: any) {
      console.error("Google Sign-up Error:", error);
      toast({
        variant: 'destructive',
        title: 'Google Sign-up Failed',
        description: error.message || 'An unexpected error occurred during Google sign-up.',
      });
    } finally {
      setIsGoogleLoading(false);
    }
  }



  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* ... existing form fields ... */}

        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || isGoogleLoading}>
          {form.formState.isSubmitting ? 'Signing Up...' : 'Sign Up'}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignUp}
          disabled={isGoogleLoading || form.formState.isSubmitting}
        >
          {isGoogleLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Connecting...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
              </svg>
              Sign up with Google
            </span>
          )}
        </Button>
      </form>
    </Form>
  );
}
