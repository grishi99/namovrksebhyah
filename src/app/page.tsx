import { Header } from '@/components/layout/header';
import Link from 'next/link';

const Logo = () => (
  <div className="relative w-64 h-64" data-ai-hint="logo tree">
    <svg
      viewBox="0 0 200 200"
      className="absolute inset-0 w-full h-full"
      style={{ transform: 'rotate(-90deg)' }}
    >
      <path
        id="circlePath"
        d="M 100, 100 m -80, 0 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0"
        fill="none"
      />
      <text fill="hsl(var(--primary))" className="text-xl font-headline">
        <textPath href="#circlePath" startOffset="25%" textAnchor="middle">
          नमो वृक्षेभ्यः
        </textPath>
      </text>
    </svg>
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative w-[150px] h-[150px]">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="50" r="48" stroke="#A52A2A" strokeWidth="2" fill="none" />
          <g transform="translate(10, 10) scale(0.8)">
            {/* Roots */}
            <path d="M 40,75 C 30,85 20,80 15,90" stroke="#8B4513" strokeWidth="1.5" fill="none" />
            <path d="M 60,75 C 70,85 80,80 85,90" stroke="#8B4513" strokeWidth="1.5" fill="none" />
            <path d="M 50,78 C 50,90 45,95 40,98" stroke="#8B4513" strokeWidth="1.5" fill="none" />
            <path d="M 50,78 C 50,90 55,95 60,98" stroke="#8B4513" strokeWidth="1.5" fill="none" />

            {/* Praying Hands as trunk */}
            <path d="M 45,75 C 45,65 40,60 50,50 C 60,60 55,65 55,75 Z" fill="#DEB887" />
            <path d="M 46,75 C 46,68 42,65 50,55 C 58,65 54,68 54,75" fill="none" stroke="#A0522D" strokeWidth="1" />

            {/* Crown of the tree */}
            <circle cx="50" cy="40" r="15" fill="#228B22" />
            <circle cx="40" cy="35" r="12" fill="#32CD32" />
            <circle cx="60" cy="35" r="12" fill="#32CD32" />
            <circle cx="35" cy="45" r="10" fill="#2E8B57" />
            <circle cx="65" cy="45" r="10" fill="#2E8B57" />
            <circle cx="50" cy="30" r="8" fill="#90EE90" />
          </g>
        </svg>
      </div>
    </div>
  </div>
);


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-[8px] leading-tight tracking-widest mb-4 font-headline text-foreground/70">
            <p>॥ विजयते श्रीबालकृष्णः प्रभुः ॥</p>
            <p>॥ श्रीवल्लभविट्ठलेशौ विजयेते ॥</p>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold font-headline mb-4">
             Namo <span className="text-primary">Vṛkṣebhyaḥ</span>
          </h1>
          <p className="text-4xl md:text-5xl font-headline text-primary/80">
            Vṛkṣāropaṇa Mahotsava
          </p>
          <div className="my-10 flex flex-col items-center justify-center relative">
            <Logo />
          </div>
          <div className="flex flex-col items-center space-y-4">
            <Link
              href="#"
              className="inline-block px-8 py-3 text-base font-semibold rounded-full text-secondary-foreground bg-gradient-to-br from-white via-blue-100 to-secondary shadow-lg border border-white/60 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-ring"
            >
              View E-brochure
            </Link>
            <Link
              href="#"
              className="inline-block px-10 py-4 text-lg font-semibold rounded-full text-secondary-foreground bg-gradient-to-br from-white via-blue-100 to-secondary shadow-lg border border-white/60 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-ring"
            >
              Fill Tree Plantation and Adoption Form
            </Link>
          </div>
        </div>
      </main>
      <footer className="w-full py-6 text-center text-sm text-foreground/60">
        <p>A Geet Sangeet Sagar Trust Initiative</p>
      </footer>
    </div>
  );
}
