
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
import { sendEmailVerification, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

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
          
          await signOut(auth);
          router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
      }

    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        try {
            // This is a re-attempt. Sign in the user to get the user object, then send verification.
            const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
            if (userCredential.user && !userCredential.user.emailVerified) {
                await sendEmailVerification(userCredential.user);
                toast({
                    title: 'Verification Email Resent',
                    description: 'This email is already registered. A new verification link has been sent to your inbox.',
                });
                await signOut(auth); // Immediately sign out the unverified user
                router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
            } else if (userCredential.user && userCredential.user.emailVerified) {
                toast({
                    variant: 'destructive',
                    title: 'Account Already Exists',
                    description: 'This account is already verified. Please log in instead.',
                });
                 // Optionally, redirect to login
                router.push('/login');
            }
        } catch (signInError: any) {
            // This could happen if the password for the existing account is wrong.
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="john.doe@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                 <div className="relative">
                  <Input 
                    type={showPassword ? 'text' : 'password'}
                    {...field} 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <div className="relative">
                    <Input 
                        type={showConfirmPassword ? 'text' : 'password'}
                        {...field} 
                    />
                    <button 
                        type="button" 
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                    >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Signing Up...' : 'Sign Up'}
        </Button>
      </form>
    </Form>
  );
}
