import { Header } from '@/components/layout/header';
import { AboutContent } from '@/components/about/about-content';

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
            <Header />
            <main className="flex-grow pt-24 pb-12 px-4 md:px-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    <h1 className="text-4xl md:text-5xl font-headline text-center text-primary font-bold mb-8">
                        About The Initiative
                    </h1>
                    <AboutContent />
                </div>
            </main>
            <footer className="w-full py-6 text-center text-sm text-foreground/60">
                <p>A Geet Sangeet Sagar Trust Initiative</p>
            </footer>
        </div>
    );
}
