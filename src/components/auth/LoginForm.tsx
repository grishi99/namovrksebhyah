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
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, User } from 'firebase/auth';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { signInWithGoogle } from '@/firebase/google-auth';
import { doc, getDoc } from 'firebase/firestore';
import { useFirestore, setDocumentNonBlocking } from '@/firebase';



const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export function LoginForm() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();
  const [user, setUser] = useState<User | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.emailVerified) {
        router.push('/tree-form');
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      if (!userCredential.user.emailVerified) {
        toast({
          variant: 'destructive',
          title: 'Email Not Verified',
          description: 'Please verify your email address before logging in. Check your inbox for a verification link.',
        });
        await auth.signOut(); // Sign out the unverified user
      } else {
        // The useEffect will handle the redirect for verified users.
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message || 'Invalid email or password.',
      });
    }
  }


  async function handleGoogleLogin() {
    setIsGoogleLoading(true);
    try {
      const userCredential = await signInWithGoogle(auth);
      const user = userCredential.user;

      if (user) {
        // Ensure user document exists (in case they log in with Google for the first time here)
        if (firestore) {
          const userDocRef = doc(firestore, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (!userDoc.exists()) {
            await setDocumentNonBlocking(userDocRef, {
              id: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              createdAt: new Date(),
            }, { merge: true });
          }
        }

        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        router.push('/tree-form');
      }
    } catch (error: any) {
      console.error("Google Login Error:", error);
      toast({
        variant: 'destructive',
        title: 'Google Login Failed',
        description: error.message || 'An unexpected error occurred during Google login.',
      });
    } finally {
      setIsGoogleLoading(false);
    }
  }

  // ... existing onSubmit

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
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between">
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || isGoogleLoading}>
            {form.formState.isSubmitting ? 'Logging In...' : 'Log In'}
          </Button>
        </div>

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
          onClick={handleGoogleLogin}
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
              Log in with Google
            </span>
          )}
        </Button>

        <div className="text-sm text-center">
          <Link href="/forgot-password" className="font-medium text-primary hover:underline">
            Forgot Password?
          </Link>
        </div>
      </form>
    </Form>
  );
}
