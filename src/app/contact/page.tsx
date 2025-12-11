'use client';

import { TopBar } from '@/components/layout/topbar';
import { Header } from '@/components/layout/header';
import { ContactSection } from '@/components/home/contact-section';

export default function ContactPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
            <TopBar />
            <Header />
            <main className="flex-grow flex flex-col items-center justify-center pt-24 pb-8">
                <ContactSection />
            </main>
            <footer className="w-full py-6 text-center text-sm text-foreground/60">
                <p>A Geet Sangeet Sagar Trust Initiative</p>
            </footer>
        </div>
    );
}
