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

                    <Card className="w-full overflow-hidden bg-white/50 backdrop-blur-sm shadow-xl border-0">
                        <div className="relative w-full aspect-[9/16] md:aspect-[16/9] lg:aspect-[9/16] max-h-[85vh] mx-auto bg-gray-100 rounded-lg overflow-hidden">
                            <object
                                data={isHindi ? "/brochures/hindi.pdf" : "/brochures/english.pdf"}
                                type="application/pdf"
                                className="w-full h-full"
                            >
                                <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gray-50">
                                    <p className="text-lg font-semibold text-gray-700 mb-2">
                                        Unable to display PDF directly.
                                    </p>
                                    <a
                                        href={isHindi ? "/brochures/hindi.pdf" : "/brochures/english.pdf"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors"
                                    >
                                        Download PDF
                                    </a>
                                </div>
                            </object>
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
