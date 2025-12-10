"use client";

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';

const slides = [
    { src: '/slideshow/kakaji.jpg', alt: 'Clean Tarheti Green Tarheti' },
    { src: '/slideshow/sec-net.jpg', alt: 'Security Net-Covering' },
    { src: '/slideshow/safety-net.jpg', alt: 'Fenced & Secured' },
    { src: '/slideshow/irrigation.jpg', alt: 'Dedicated Irrigation & Care' },
];

import { Info } from 'lucide-react';

export const Slideshow = () => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
        Autoplay({ delay: 3000, stopOnInteraction: false })
    ]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [showDisclaimer, setShowDisclaimer] = useState(false);

    const onSelect = useCallback((emblaApi: any) => {
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, []);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect(emblaApi);
        emblaApi.on('select', onSelect);
    }, [emblaApi, onSelect]);

    return (
        <div className="relative w-full max-w-sm mx-auto overflow-visible rounded-xl shadow-lg border border-primary/20 bg-background/50 backdrop-blur-sm group">
            {/* Disclaimer Icon & Popup */}
            <div className="absolute -top-3 -right-3 z-50">
                <button
                    onClick={() => setShowDisclaimer(!showDisclaimer)}
                    className="bg-white text-green-600 rounded-full p-1 shadow-md hover:scale-110 transition-transform"
                    aria-label="Information"
                >
                    <Info size={20} />
                </button>

                {showDisclaimer && (
                    <div className="absolute top-8 right-0 w-48 bg-white p-3 rounded-lg shadow-xl border border-gray-100 text-xs text-gray-700 animate-in fade-in zoom-in duration-200">
                        These images are for representational purposes and offer a glimpse into the upcoming project.
                    </div>
                )}
            </div>

            <div className="overflow-hidden rounded-xl" ref={emblaRef}>
                <div className="flex">
                    {slides.map((slide, index) => (
                        <div className="relative flex-[0_0_100%] min-w-0" key={index}>
                            <div className="relative aspect-[9/16] w-full">
                                <Image
                                    src={slide.src}
                                    alt={slide.alt}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    priority={index === 0}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Dots */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${index === selectedIndex ? 'bg-white w-4' : 'bg-white/50'
                            }`}
                        onClick={() => emblaApi?.scrollTo(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};
