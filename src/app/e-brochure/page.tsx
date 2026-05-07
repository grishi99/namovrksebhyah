'use client';

import { useEffect, useState } from 'react';
import { TopBar } from '@/components/layout/topbar';
import { Header } from '@/components/layout/header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Leaf,
    Calendar,
    Camera,
    Instagram,
    ExternalLink,
    Sparkles,
} from 'lucide-react';

const INSTAGRAM_HANDLE = 'namovrksebhyah';
const INSTAGRAM_PROFILE_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`;

const instagramPosts = [
    'https://www.instagram.com/p/DV-cN-CCG7Y/',
    'https://www.instagram.com/p/DWEsNO0D_P_/',
    'https://www.instagram.com/p/DWLUpoGiOUj/',
];

const hashtags = [
    'VrksaropanaMahotsava',
    'NamoVrksebhyah',
    'PlantATree',
    'GeetSangeetSagar',
    'March2026',
];

export default function EBrochurePage() {
    const [embedsReady, setEmbedsReady] = useState(false);

    useEffect(() => {
        const processEmbeds = () => {
            (window as any).instgrm?.Embeds?.process();
            setTimeout(() => setEmbedsReady(true), 1500);
        };

        const existingScript = document.querySelector(
            'script[src="//www.instagram.com/embed.js"]',
        );

        if (!existingScript) {
            const script = document.createElement('script');
            script.src = '//www.instagram.com/embed.js';
            script.async = true;
            script.onload = processEmbeds;
            document.body.appendChild(script);
            return;
        }

        processEmbeds();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
            <TopBar />
            <Header />

            <main className="flex-grow pt-24 pb-16 px-4">
                {/* HERO */}
                <section className="relative w-full max-w-6xl mx-auto">
                    <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
                        <Leaf className="absolute -top-6 -left-6 h-40 w-40 text-primary/10 rotate-[-20deg]" />
                        <Leaf className="absolute -bottom-8 -right-4 h-44 w-44 text-primary/10 rotate-[40deg]" />
                    </div>

                    <div className="text-center space-y-5 py-12 px-6">
                        <div className="flex items-center justify-center gap-3 text-primary/70">
                            <span className="h-px w-12 bg-primary/30" />
                            <Sparkles className="h-5 w-5" />
                            <span className="h-px w-12 bg-primary/30" />
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold font-headline text-primary leading-tight">
                            Vṛkṣāropaṇa Mahotsava 1.0
                        </h1>
                        <p className="text-xl md:text-2xl font-headline text-foreground/70 italic">
                            · Moments ·
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                            <Badge
                                variant="secondary"
                                className="text-base px-4 py-1.5 gap-2 bg-red-50 text-red-700 border border-red-200 hover:bg-red-50"
                            >
                                <Calendar className="h-4 w-4" />
                                19–22 March 2026
                            </Badge>
                            <Badge
                                variant="secondary"
                                className="text-base px-4 py-1.5 gap-2 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/10"
                            >
                                <Camera className="h-4 w-4" />
                                {instagramPosts.length} posts
                            </Badge>
                            <Badge
                                variant="secondary"
                                className="text-base px-4 py-1.5 gap-2 bg-foreground/5 text-foreground/80 border border-foreground/10 hover:bg-foreground/5"
                            >
                                <Instagram className="h-4 w-4" />@{INSTAGRAM_HANDLE}
                            </Badge>
                        </div>

                        <p className="max-w-2xl mx-auto text-foreground/70 text-base md:text-lg pt-2">
                            A glimpse into four days of planting, music, and
                            gratitude — straight from our Instagram.
                        </p>
                    </div>
                </section>

                {/* DECORATIVE DIVIDER */}
                <div className="flex items-center justify-center gap-3 my-12 max-w-6xl mx-auto">
                    <span className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/30" />
                    <Leaf className="h-5 w-5 text-primary/60" />
                    <span className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/30" />
                </div>

                {/* GALLERY GRID */}
                <section className="w-full max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-items-center">
                        {instagramPosts.map((postUrl, idx) => (
                            <Card
                                key={postUrl}
                                style={{
                                    animationDelay: `${idx * 120}ms`,
                                }}
                                className="group relative w-full max-w-[400px] overflow-hidden rounded-2xl border-foreground/10 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-2 hover:ring-primary/30 animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-700"
                            >
                                <div
                                    className="relative overflow-hidden"
                                    style={{ height: 540 }}
                                >
                                    {!embedsReady && (
                                        <div className="absolute inset-0 z-0 flex flex-col gap-3 p-4">
                                            <div className="flex items-center gap-3">
                                                <Skeleton className="h-10 w-10 rounded-full" />
                                                <div className="flex-1 space-y-2">
                                                    <Skeleton className="h-3 w-1/3" />
                                                    <Skeleton className="h-2 w-1/4" />
                                                </div>
                                            </div>
                                            <Skeleton className="flex-1 w-full rounded-md" />
                                            <div className="space-y-2">
                                                <Skeleton className="h-3 w-1/2" />
                                                <Skeleton className="h-3 w-3/4" />
                                            </div>
                                        </div>
                                    )}

                                    <blockquote
                                        className="instagram-media relative z-10"
                                        data-instgrm-permalink={postUrl}
                                        data-instgrm-version="14"
                                        style={{
                                            background: '#fff',
                                            border: 0,
                                            borderRadius: 0,
                                            boxShadow: 'none',
                                            margin: 0,
                                            maxWidth: '100%',
                                            minWidth: 0,
                                            padding: 0,
                                            width: '100%',
                                        }}
                                    >
                                        <a
                                            href={postUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            View this post on Instagram
                                        </a>
                                    </blockquote>

                                    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-20 bg-gradient-to-t from-white via-white/85 to-transparent" />
                                </div>

                                <a
                                    href={postUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-1.5 py-3 text-sm font-medium text-foreground/60 hover:text-primary transition-colors border-t border-foreground/5"
                                >
                                    Open on Instagram
                                    <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* DIVIDER */}
                <div className="flex items-center justify-center gap-3 my-14 max-w-6xl mx-auto">
                    <span className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/30" />
                    <Leaf className="h-5 w-5 text-primary/60" />
                    <span className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/30" />
                </div>

                {/* FOLLOW CTA */}
                <section className="w-full max-w-3xl mx-auto">
                    <Card className="relative overflow-hidden rounded-3xl border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/10 p-8 md:p-12 text-center">
                        <Leaf className="absolute -top-4 -right-4 h-28 w-28 text-primary/10 rotate-12" />

                        <h2 className="text-2xl md:text-3xl font-bold font-headline text-primary">
                            Catch every moment
                        </h2>
                        <p className="mt-2 text-foreground/70 max-w-xl mx-auto">
                            Follow us on Instagram for all photos, reels, and
                            behind-the-scenes from the Mahotsava.
                        </p>

                        <Button
                            asChild
                            size="lg"
                            className="mt-6 h-12 px-7 text-base font-semibold gap-2 bg-gradient-to-r from-[#feda75] via-[#d62976] to-[#4f5bd5] text-white shadow-md hover:shadow-lg hover:opacity-95"
                        >
                            <a
                                href={INSTAGRAM_PROFILE_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Instagram className="h-5 w-5" />
                                Follow @{INSTAGRAM_HANDLE}
                                <ExternalLink className="h-4 w-4 opacity-80" />
                            </a>
                        </Button>

                        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                            {hashtags.map((tag) => (
                                <Badge
                                    key={tag}
                                    variant="outline"
                                    className="text-xs md:text-sm font-normal text-primary/80 border-primary/20 bg-primary/5 hover:bg-primary/10"
                                >
                                    #{tag}
                                </Badge>
                            ))}
                        </div>
                    </Card>
                </section>
            </main>

            <footer className="w-full py-6 text-center text-sm text-foreground/60">
                <p>A Geet Sangeet Sagar Trust Initiative</p>
            </footer>
        </div>
    );
}
