'use client';

import { useState, useEffect } from 'react';
import { TopBar } from '@/components/layout/topbar';
import { Header } from '@/components/layout/header';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Leaf, Download, FileText, Globe, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import react-pdf components to prevent SSR issues
const Document = dynamic(() => import('react-pdf').then(mod => mod.Document), {
    ssr: false,
    loading: () => (
        <div className="flex flex-col items-center justify-center p-12">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-primary font-medium">Loading viewer...</p>
        </div>
    )
});

const Page = dynamic(() => import('react-pdf').then(mod => mod.Page), { ssr: false });

import { pdfjs } from 'react-pdf';

// Set worker source for react-pdf
if (typeof window !== 'undefined') {
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

export default function EBrochurePage() {
    const [isHindi, setIsHindi] = useState(false);
    const [numPages, setNumPages] = useState<number | null>(null);
    const [loadFailed, setLoadFailed] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [viewerWidth, setViewerWidth] = useState(800);

    useEffect(() => {
        const updateWidth = () => {
            setViewerWidth(Math.min(window.innerWidth * 0.95, 800));
        };
        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    const pdfPath = isHindi ? '/brochures/hindi.pdf' : '/brochures/english.pdf';

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setLoadFailed(false);
        setIsLoading(false);
    }

    function onDocumentLoadError(error: Error) {
        console.error('Error loading PDF:', error);
        setLoadFailed(true);
        setIsLoading(false);
    }

    // Reset page number and reload state when language changes
    useEffect(() => {
        setPageNumber(1);
        setIsLoading(true);
        setLoadFailed(false);
        setNumPages(null);
    }, [isHindi]);

    const changePage = (offset: number) => {
        setPageNumber(prevPageNumber => {
            const next = prevPageNumber + offset;
            if (numPages && next >= 1 && next <= numPages) {
                return next;
            }
            return prevPageNumber;
        });
    };

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
                            Explore our comprehensive guide to the Vṛkṣāropaṇa Mahotsava initiative, rendered directly in your browser.
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
                    <Card className="w-full overflow-hidden bg-white/40 backdrop-blur-sm shadow-2xl border-primary/10 rounded-2xl min-h-[60vh] flex flex-col items-center justify-center">
                        <CardContent className="p-0 relative w-full flex flex-col items-center justify-center">
                            {isLoading && (
                                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
                                    <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                                    <p className="text-primary font-medium">Loading brochure...</p>
                                </div>
                            )}

                            {loadFailed ? (
                                <div className="py-16 text-center space-y-4">
                                    <p className="text-muted-foreground">Could not render the PDF in browser.</p>
                                    <Button asChild variant="outline" className="rounded-full border-primary/20">
                                        <a href={pdfPath} target="_blank" rel="noopener noreferrer">
                                            <Globe className="w-4 h-4 mr-2" />
                                            Open PDF Directly
                                        </a>
                                    </Button>
                                </div>
                            ) : (
                                <div className="w-full flex flex-col items-center justify-center overflow-auto py-8">
                                    <Document
                                        file={pdfPath}
                                        onLoadSuccess={onDocumentLoadSuccess}
                                        onLoadError={onDocumentLoadError}
                                        loading={null}
                                        className="flex flex-col items-center"
                                    >
                                        <Page
                                            pageNumber={pageNumber}
                                            renderTextLayer={false}
                                            renderAnnotationLayer={false}
                                            className="shadow-xl"
                                            loading={null}
                                            width={viewerWidth}
                                        />
                                    </Document>
                                </div>
                            )}

                            {/* Pagination Controls */}
                            {numPages && (
                                <div className="bg-white/90 backdrop-blur-sm border-t border-primary/10 w-full p-4 flex items-center justify-between z-10 sticky bottom-0">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => changePage(-1)}
                                        disabled={pageNumber <= 1}
                                        className="gap-1 rounded-full"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        Previous
                                    </Button>

                                    <span className="text-sm font-medium text-foreground">
                                        Page <span className="text-primary">{pageNumber}</span> of {numPages}
                                    </span>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => changePage(1)}
                                        disabled={numPages ? pageNumber >= numPages : true}
                                        className="gap-1 rounded-full"
                                    >
                                        Next
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Button variant="ghost" asChild className="text-muted-foreground hover:text-primary rounded-full">
                            <a href={pdfPath} target="_blank" rel="noopener noreferrer">
                                <Globe className="w-4 h-4 mr-2" />
                                View Full Screen
                            </a>
                        </Button>
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
