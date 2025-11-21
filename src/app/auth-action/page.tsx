'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/firebase';
import { applyActionCode, checkActionCode } from 'firebase/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

function AuthActionContent() {
    const auth = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'already-verified'>('loading');
    const [errorMessage, setErrorMessage] = useState('');
    const [shouldAutoClose, setShouldAutoClose] = useState(false);

    useEffect(() => {
        const handleEmailVerification = async () => {
            const mode = searchParams.get('mode');
            const oobCode = searchParams.get('oobCode');

            // Only handle email verification actions
            if (mode !== 'verifyEmail' || !oobCode) {
                setStatus('error');
                setErrorMessage('Invalid verification link.');
                return;
            }

            try {
                // First check if the code is valid and get info about it
                const info = await checkActionCode(auth, oobCode);

                // Apply the verification code
                await applyActionCode(auth, oobCode);

                // Reload the current user to get updated emailVerified status
                if (auth.currentUser) {
                    await auth.currentUser.reload();
                }

                // Set flag in localStorage to notify other tabs
                localStorage.setItem('email_verified', 'true');
                localStorage.setItem('email_verified_timestamp', Date.now().toString());

                setStatus('success');
                setShouldAutoClose(true);

                // Try to auto-close the tab after 2 seconds
                setTimeout(() => {
                    try {
                        window.close();
                        // If window.close() doesn't work (some browsers block it), show redirect button
                    } catch (e) {
                        console.log('Could not auto-close window');
                    }
                }, 2000);

            } catch (error: any) {
                console.error('Verification error:', error);

                if (error.code === 'auth/expired-action-code') {
                    setStatus('error');
                    setErrorMessage('This verification link has expired. Please request a new one.');
                } else if (error.code === 'auth/invalid-action-code') {
                    setStatus('error');
                    setErrorMessage('This verification link is invalid or has already been used.');
                } else if (error.code === 'auth/user-disabled') {
                    setStatus('error');
                    setErrorMessage('This account has been disabled.');
                } else {
                    // Check if user is already verified
                    if (auth.currentUser?.emailVerified) {
                        setStatus('already-verified');
                        // Still set the localStorage flag
                        localStorage.setItem('email_verified', 'true');
                        localStorage.setItem('email_verified_timestamp', Date.now().toString());
                        setShouldAutoClose(true);
                        setTimeout(() => {
                            try {
                                window.close();
                            } catch (e) {
                                console.log('Could not auto-close window');
                            }
                        }, 2000);
                    } else {
                        setStatus('error');
                        setErrorMessage(error.message || 'An error occurred during verification.');
                    }
                }
            }
        };

        handleEmailVerification();
    }, [auth, searchParams]);

    // Loading state
    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <div className="mx-auto bg-primary/10 p-3 rounded-full">
                            <Loader2 className="w-12 h-12 text-primary animate-spin" />
                        </div>
                        <CardTitle className="mt-4">Verifying Your Email</CardTitle>
                        <CardDescription>
                            Please wait while we verify your email address...
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    // Success state
    if (status === 'success') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <div className="mx-auto bg-green-100 dark:bg-green-900/20 p-3 rounded-full">
                            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                        </div>
                        <CardTitle className="mt-4 text-green-600 dark:text-green-400">Email Verified!</CardTitle>
                        <CardDescription>
                            Your email has been successfully verified. {shouldAutoClose ? 'This tab will close automatically...' : ''}
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

    // Already verified state
    if (status === 'already-verified') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <div className="mx-auto bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full">
                            <CheckCircle className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                        </div>
                        <CardTitle className="mt-4 text-blue-600 dark:text-blue-400">Already Verified</CardTitle>
                        <CardDescription>
                            Your email was already verified. {shouldAutoClose ? 'This tab will close automatically...' : ''}
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

    // Error state
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="mx-auto bg-red-100 dark:bg-red-900/20 p-3 rounded-full">
                        <XCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
                    </div>
                    <CardTitle className="mt-4 text-red-600 dark:text-red-400">Verification Failed</CardTitle>
                    <CardDescription>
                        {errorMessage}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Button onClick={() => router.push('/verify-email')} className="w-full">
                        Request New Verification Email
                    </Button>
                    <Button onClick={() => router.push('/login')} variant="outline" className="w-full">
                        Go to Login
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default function AuthActionPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        }>
            <AuthActionContent />
        </Suspense>
    );
}
