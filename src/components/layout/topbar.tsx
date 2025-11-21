"use client";

import Link from 'next/link';
import { Home } from 'lucide-react';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function TopBar() {
    const { user, isUserLoading } = useUser();
    const auth = useAuth();
    const router = useRouter();

    // Extract username from email (part before @)
    const username = user?.email?.split('@')[0] || 'User';

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            router.push('/');
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    return (
        <div className="fixed top-0 left-0 right-0 z-40 pointer-events-none">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-start justify-between pt-4">
                    {/* Left side - Trust name and home icon */}
                    <div className="pointer-events-auto">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-green-700 hover:text-green-800 transition-colors bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md"
                        >
                            <Home className="h-5 w-5" />
                            <span className="text-base font-semibold hidden sm:inline">Geet Sangeet Sagar Trust</span>
                        </Link>
                    </div>

                    {/* Right side - Username and Sign out */}
                    {!isUserLoading && user && (
                        <div className="flex items-center gap-3 pointer-events-auto bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
                            <span className="text-sm text-gray-700 hidden sm:inline">
                                {username}
                            </span>
                            <Button
                                onClick={handleSignOut}
                                variant="outline"
                                size="sm"
                                className="border-gray-300 hover:bg-gray-50"
                            >
                                Sign out
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
