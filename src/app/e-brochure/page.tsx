'use client';

import { useState } from 'react';
import { TopBar } from '@/components/layout/topbar';
import { Header } from '@/components/layout/header';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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
                        <div className="relative w-full aspect-[9/16] md:aspect-[16/9] lg:aspect-[9/16] max-h-[85vh] mx-auto">
                            {isHindi ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                                    <div className="text-center p-8">
                                        <p className="text-xl font-semibold text-gray-500">हिंदी विवरण जल्द ही आ रहा है</p>
                                        <p className="text-sm text-gray-400 mt-2">(Hindi Brochure Coming Soon)</p>
                                    </div>
                                </div>
                            ) : (
                                <iframe
                                    src="/brochures/english.pdf#toolbar=0&navpanes=0&scrollbar=0"
                                    className="w-full h-full border-none"
                                    title="E-Brochure English"
                                />
                            )}
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
