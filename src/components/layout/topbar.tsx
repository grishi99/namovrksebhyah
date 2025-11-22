"use client";

import { useState, useEffect } from 'react';
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
    const [isAtTop, setIsAtTop] = useState(true);

    // Extract username from email (part before @)
    const username = user?.email?.split('@')[0] || 'User';

    // Track scroll position to show/hide TopBar
    useEffect(() => {
        const handleScroll = () => {
            setIsAtTop(window.scrollY < 100);
        };

        // Set initial state
        handleScroll();

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            router.push('/');
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    // Don't render if not at top
    if (!isAtTop) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-40 pointer-events-none">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pr-20 sm:pr-6">
                <div className="flex items-start justify-between pt-4 gap-2">
                    {/* Left side - Trust name and home icon */}
                    <div className="pointer-events-auto">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-green-700 hover:text-green-800 transition-colors bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md font-semibold"
                        >
                            <Home className="h-5 w-5" />
                            <span className="hidden sm:inline">Geet Sangeet Sagar Trust</span>
                        </Link>
                    </div>

                    {/* Right side - Username and Sign out */}
                    {!isUserLoading && user && (
                        <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto">
                            <span className="text-sm text-gray-700 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md max-w-[100px] sm:max-w-none truncate">
                                {username}
                            </span>
                            <Button
                                onClick={handleSignOut}
                                className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-md rounded-full font-bold text-green-700 hover:text-green-800 border-0 h-10 px-4"
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
