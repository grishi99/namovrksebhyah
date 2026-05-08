'use client';

import { useState } from 'react';
import { TopBar } from '@/components/layout/topbar';
import { Header } from '@/components/layout/header';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Leaf, Download, FileText, Globe, Loader2 } from 'lucide-react';

const BASE_URL = 'https://namovrksebhyah.org';

export default function EBrochurePage() {
    const [isHindi, setIsHindi] = useState(false);
    const [loading, setLoading] = useState(true);

    // Use a timestamp or version to bust cache
    const pdfPath = isHindi ? '/brochures/hindi.pdf?v=3' : '/brochures/english.pdf?v=3';
    
    // Encode the URL for Google Docs viewer
    const fullPdfUrl = `${BASE_URL}${pdfPath}`;
    const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(fullPdfUrl)}&embedded=true`;

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
            <TopBar />
            <Header />

            <main className="flex-grow flex flex-col items-center pt-28 pb-12 px-4 relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
                    <Leaf className="absolute top-20 -left-10 h-64 w-64 text-primary/5 rotate-[-15deg]" />
                    <Leaf className="absolute bottom-20 -right-10 h-72 w-72 text-primary/5 rotate-[30deg]" />
                </div>

                <div className="w-full max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">
                            E-Brochure
                        </h1>
                        <p className="text-muted-foreground max-w-xl mx-auto">
                            Explore our comprehensive guide to the Vṛkṣāropaṇa Mahotsava 2.0.
                        </p>
                    </div>

                    {/* Language Toggle */}
                    <div className="flex items-center justify-center space-x-6 bg-white/50 backdrop-blur-md p-4 rounded-full shadow-sm border border-primary/10 w-fit mx-auto">
                        <div
                            className={`flex items-center space-x-2 cursor-pointer transition-colors ${!isHindi ? 'text-primary' : 'text-muted-foreground'}`}
                            onClick={() => { setIsHindi(false); setLoading(true); }}
                        >
                            <Globe className="w-4 h-4" />
                            <span className="font-bold">English</span>
                        </div>

                        <Switch
                            checked={isHindi}
                            onCheckedChange={(v) => { setIsHindi(v); setLoading(true); }}
                            className="data-[state=checked]:bg-primary"
                        />

                        <div
                            className={`flex items-center space-x-2 cursor-pointer transition-colors ${isHindi ? 'text-primary' : 'text-muted-foreground'}`}
                            onClick={() => { setIsHindi(true); setLoading(true); }}
                        >
                            <Globe className="w-4 h-4" />
                            <span className="font-bold text-lg">हिंदी</span>
                        </div>
                    </div>

                    {/* PDF Viewer via Google Docs */}
                    <div className="w-full rounded-2xl overflow-hidden shadow-2xl border border-primary/10 bg-white/40 backdrop-blur-sm relative">
                        {loading && (
                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
                                <Loader2 className="w-10 h-10 text-primary animate-spin mb-3" />
                                <p className="text-primary font-medium text-sm">Loading brochure…</p>
                            </div>
                        )}
                        <iframe
                            key={`${isHindi}-${viewerUrl}`}
                            src={viewerUrl}
                            title="E-Brochure"
                            className="w-full h-[80vh] md:h-[90vh]"
                            style={{ border: 'none', display: 'block' }}
                            onLoad={() => setLoading(false)}
                            allow="autoplay"
                        />
                        {!loading && (
                           <div className="p-4 bg-primary/5 text-center text-xs text-muted-foreground border-t border-primary/10">
                             Can't see the brochure? <a href={pdfPath} target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium">Try opening directly</a> or refresh the page.
                           </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Button variant="outline" asChild className="rounded-full border-primary/20 hover:bg-primary/5">
                            <a href={pdfPath} download>
                                <Download className="w-4 h-4 mr-2" />
                                Download Brochure
                            </a>
                        </Button>
                    </div>
                </div>
            </main>

            <footer className="w-full py-8 text-center text-sm text-foreground/60 border-t border-primary/5">
                <p>A Geet Sangeet Sagar Trust Initiative</p>
            </footer>
        </div>
    );
}
