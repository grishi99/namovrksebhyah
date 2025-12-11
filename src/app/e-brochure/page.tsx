'use client';

import { useState } from 'react';
import { TopBar } from '@/components/layout/topbar';
import { Header } from '@/components/layout/header';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';

export default function EBrochurePage() {
    const [isHindi, setIsHindi] = useState(false);

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
            <TopBar />
            <Header />
            <main className="flex-grow flex flex-col items-center pt-24 pb-8 px-4">
                <div className="w-full max-w-4xl space-y-6">
                    <div className="flex items-center justify-center space-x-4 mb-8">
                        <span className={`cursor-pointer font-bold ${!isHindi ? 'text-primary' : 'text-gray-400'}`} onClick={() => setIsHindi(false)}>
                            English
                        </span>
                        <Switch
                            checked={isHindi}
                            onCheckedChange={setIsHindi}
                            className="data-[state=checked]:bg-primary"
                        />
                        <span className={`cursor-pointer font-bold ${isHindi ? 'text-primary' : 'text-gray-400'}`} onClick={() => setIsHindi(true)}>
                            हिंदी
                        </span>
                    </div>

                    <div className="flex justify-center mb-4">
                        <a
                            href={isHindi ? "/brochures/hindi.pdf" : "/brochures/english.pdf"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline underline-offset-4 flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                            Download PDF
                        </a>
                    </div>

                    <Card className="w-full overflow-hidden bg-white/50 backdrop-blur-sm shadow-xl border-0">
                        <div className="relative w-full aspect-[9/16] md:aspect-[16/9] lg:aspect-[9/16] max-h-[85vh] mx-auto bg-gray-100 rounded-lg overflow-hidden">
                            <iframe
                                src={isHindi ? "/brochures/hindi.pdf" : "/brochures/english.pdf"}
                                className="w-full h-full border-none"
                                title="E-Brochure"
                            />
                        </div>
                    </Card>
                </div>
            </main>
            <footer className="w-full py-6 text-center text-sm text-foreground/60">
                <p>A Geet Sangeet Sagar Trust Initiative</p>
            </footer>
        </div>
    );
}
