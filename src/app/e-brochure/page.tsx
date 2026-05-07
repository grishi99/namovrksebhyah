'use client';

import { useEffect } from 'react';
import { TopBar } from '@/components/layout/topbar';
import { Header } from '@/components/layout/header';

const instagramPosts = [
    'https://www.instagram.com/p/DV-cN-CCG7Y/',
    'https://www.instagram.com/p/DWEsNO0D_P_/',
    'https://www.instagram.com/p/DWLUpoGiOUj/',
];

export default function EBrochurePage() {
    useEffect(() => {
        const existingScript = document.querySelector('script[src="//www.instagram.com/embed.js"]');

        if (!existingScript) {
            const script = document.createElement('script');
            script.src = '//www.instagram.com/embed.js';
            script.async = true;
            document.body.appendChild(script);
            return;
        }

        (window as any).instgrm?.Embeds?.process();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
            <TopBar />
            <Header />
            <main className="flex-grow flex flex-col items-center pt-24 pb-10 px-4">
                <div className="w-full max-w-6xl space-y-8">
                    <div className="text-center space-y-3">
                        <h1 className="text-3xl md:text-5xl font-bold font-headline text-primary">
                            Vṛkṣāropaṇa Mahotsava 1.0 Pictures
                        </h1>
                        <p className="text-xl md:text-2xl font-bold text-red-600">
                            19-22 March 2026
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start justify-items-center">
                        {instagramPosts.map((postUrl) => (
                            <div key={postUrl} className="w-full max-w-[540px] flex justify-center">
                                <blockquote
                                    className="instagram-media"
                                    data-instgrm-captioned
                                    data-instgrm-permalink={postUrl}
                                    data-instgrm-version="14"
                                    style={{
                                        background: '#fff',
                                        border: 0,
                                        borderRadius: 8,
                                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.15)',
                                        margin: 0,
                                        maxWidth: 540,
                                        minWidth: 326,
                                        padding: 0,
                                        width: '100%',
                                    }}
                                >
                                    <a href={postUrl} target="_blank" rel="noopener noreferrer">
                                        View this post on Instagram
                                    </a>
                                </blockquote>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <footer className="w-full py-6 text-center text-sm text-foreground/60">
                <p>A Geet Sangeet Sagar Trust Initiative</p>
            </footer>
        </div>
    );
}
