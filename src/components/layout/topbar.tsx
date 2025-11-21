"use client";

import Link from 'next/link';
import { Home, Menu } from 'lucide-react';
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
        <header className="w-full bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left side - Trust name and home icon */}
                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-green-700 hover:text-green-800 transition-colors"
                        >
                            <Home className="h-5 w-5" />
                            <span className="text-lg font-semibold">Geet Sangeet Sagar Trust</span>
                        </Link>
                    </div>

                    {/* Right side - Username and Sign out */}
                    <div className="flex items-center gap-4">
                        {!isUserLoading && user && (
                            <>
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
                            </>
                        )}

                        {/* Mobile menu icon - optional, can be removed if not needed */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}
