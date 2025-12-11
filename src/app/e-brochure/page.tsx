'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { TopBar } from '@/components/layout/topbar';
import { Header } from '@/components/layout/header';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2, Download } from 'lucide-react';

// Dynamically import react-pdf to avoid SSR issues
const Document = dynamic(() => import('react-pdf').then(mod => mod.Document), { ssr: false });
const Page = dynamic(() => import('react-pdf').then(mod => mod.Page), { ssr: false });

export default function EBrochurePage() {
    const [isHindi, setIsHindi] = useState(false);
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [pdfJsLoaded, setPdfJsLoaded] = useState(false);

    const pdfFile = isHindi ? '/brochures/hindi.pdf' : '/brochures/english.pdf';

    // Setup pdfjs worker on client side only
    useState(() => {
        if (typeof window !== 'undefined') {
            import('react-pdf').then(({ pdfjs }) => {
                pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
                setPdfJsLoaded(true);
            });
        }
    });

    const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setPageNumber(1);
        setIsLoading(false);
    }, []);

    const onDocumentLoadError = useCallback((error: Error) => {
        console.error('Error loading PDF:', error);
        setIsLoading(false);
    }, []);

    const goToPrevPage = () => setPageNumber(prev => Math.max(prev - 1, 1));
    const goToNextPage = () => setPageNumber(prev => Math.min(prev + 1, numPages || 1));

    const handleLanguageChange = (hindi: boolean) => {
        setIsHindi(hindi);
        setPageNumber(1);
        setIsLoading(true);
    };

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
            <TopBar />
            <Header />
            <main className="flex-grow flex flex-col items-center pt-24 pb-8 px-2">
                <div className="w-full max-w-lg space-y-4">
                    {/* Language Toggle */}
                    <div className="flex items-center justify-center space-x-4">
                        <span
                            className={`cursor-pointer font-bold transition-colors ${!isHindi ? 'text-primary' : 'text-gray-400'}`}
                            onClick={() => handleLanguageChange(false)}
                        >
                            English
                        </span>
                        <Switch
                            checked={isHindi}
                            onCheckedChange={handleLanguageChange}
                            className="data-[state=checked]:bg-primary"
                        />
                        <span
                            className={`cursor-pointer font-bold transition-colors ${isHindi ? 'text-primary' : 'text-gray-400'}`}
                            onClick={() => handleLanguageChange(true)}
                        >
                            हिंदी
                        </span>
                    </div>

                    {/* Download Button */}
                    <div className="flex justify-center">
                        <a
                            href={pdfFile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline underline-offset-4 flex items-center gap-2"
                        >
                            <Download className="h-4 w-4" />
                            Download PDF
                        </a>
                    </div>

                    {/* PDF Viewer - fits tightly to PDF */}
                    <div className="relative flex flex-col items-center">
                        {/* Loading State */}
                        {(isLoading || !pdfJsLoaded) && (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        )}

                        {/* PDF Document - renders inline, no extra card wrapper */}
                        {pdfJsLoaded && (
                            <Document
                                file={pdfFile}
                                onLoadSuccess={onDocumentLoadSuccess}
                                onLoadError={onDocumentLoadError}
                                loading={null}
                                className="flex justify-center"
                            >
                                <Page
                                    pageNumber={pageNumber}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                    className="shadow-xl rounded-lg overflow-hidden"
                                    width={typeof window !== 'undefined' ? Math.min(400, window.innerWidth - 32) : 350}
                                />
                            </Document>
                        )}

                        {/* Page Navigation Controls */}
                        {numPages && numPages > 0 && !isLoading && (
                            <div className="flex items-center justify-center gap-4 mt-4 w-full">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={goToPrevPage}
                                    disabled={pageNumber <= 1}
                                    className="bg-white"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>

                                <span className="text-sm font-medium min-w-[100px] text-center">
                                    Page {pageNumber} of {numPages}
                                </span>

                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={goToNextPage}
                                    disabled={pageNumber >= numPages}
                                    className="bg-white"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <footer className="w-full py-6 text-center text-sm text-foreground/60">
                <p>A Geet Sangeet Sagar Trust Initiative</p>
            </footer>
        </div>
    );
}
