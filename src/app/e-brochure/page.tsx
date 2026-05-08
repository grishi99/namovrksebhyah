'use client';

import { useState } from 'react';
import { TopBar } from '@/components/layout/topbar';
import { Header } from '@/components/layout/header';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Leaf, Download, FileText, Globe } from 'lucide-react';

export default function EBrochurePage() {
    const [isHindi, setIsHindi] = useState(false);

    const pdfPath = isHindi ? "/brochures/hindi.pdf" : "/brochures/english.pdf";

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

                <div className="w-full max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="text-center space-y-4">
                        <Badge variant="outline" className="px-4 py-1 border-primary/20 bg-primary/5 text-primary text-sm font-medium">
                            <FileText className="w-3.5 h-3.5 mr-2" />
                            Official Publication
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">
                            E-Brochure
                        </h1>
                        <p className="text-muted-foreground max-w-xl mx-auto">
                            Explore our comprehensive guide to the Vṛkṣāropaṇa Mahotsava initiative, detailed in both English and Hindi.
                        </p>
                    </div>

                    {/* Language Toggle */}
                    <div className="flex items-center justify-center space-x-6 bg-white/50 backdrop-blur-md p-4 rounded-full shadow-sm border border-primary/10 w-fit mx-auto">
                        <div 
                            className={`flex items-center space-x-2 cursor-pointer transition-colors ${!isHindi ? 'text-primary' : 'text-muted-foreground'}`}
                            onClick={() => setIsHindi(false)}
                        >
                            <Globe className="w-4 h-4" />
                            <span className="font-bold">English</span>
                        </div>
                        
                        <Switch
                            checked={isHindi}
                            onCheckedChange={setIsHindi}
                            className="data-[state=checked]:bg-primary"
                        />
                        
                        <div 
                            className={`flex items-center space-x-2 cursor-pointer transition-colors ${isHindi ? 'text-primary' : 'text-muted-foreground'}`}
                            onClick={() => setIsHindi(true)}
                        >
                            <Globe className="w-4 h-4" />
                            <span className="font-bold text-lg">हिंदी</span>
                        </div>
                    </div>

                    {/* PDF Viewer Container */}
                    <Card className="w-full overflow-hidden bg-white/40 backdrop-blur-sm shadow-2xl border-primary/10 rounded-2xl">
                        <CardContent className="p-0 relative group">
                            <div className="relative w-full aspect-[9/16] md:aspect-[16/9] lg:aspect-[3/4] max-h-[80vh] mx-auto bg-gray-100/50">
                                <embed
                                    src={pdfPath}
                                    type="application/pdf"
                                    className="w-full h-full rounded-xl"
                                />
                            </div>

                            {/* Floating Download Button (Mobile/Tablet accessibility) */}
                            <div className="md:hidden absolute bottom-6 right-6 z-20">
                                <Button asChild size="icon" className="rounded-full h-12 w-12 shadow-xl">
                                    <a href={pdfPath} download>
                                        <Download className="w-5 h-5" />
                                    </a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <div className="text-center pt-4">
                        <Button variant="ghost" asChild className="text-muted-foreground hover:text-primary">
                            <a href={pdfPath} target="_blank" rel="noopener noreferrer">
                                <Download className="w-4 h-4 mr-2" />
                                Open in New Tab
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
