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
          <circle
            cx="50"
            cy="50"
            r="48"
            stroke="hsl(var(--primary))"
            strokeWidth="1.5"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="44"
            stroke="hsl(var(--primary))"
            strokeWidth="1.5"
            fill="hsl(var(--card))"
          />

          <g transform="translate(5, 5)">
            <path
              d="M45 40 C 40 40, 35 45, 35 50 L 35 70 C 35 75, 40 80, 45 80 L 45 40 Z"
              fill="#d2a679"
            />
            <path
              d="M45 40 C 50 40, 55 45, 55 50 L 55 70 C 55 75, 50 80, 45 80 L 45 40 Z"
              fill="#c69c6d"
              transform="scale(-1, 1) translate(-90, 0)"
            />
            <path
              d="M45 40 L 45 30 C 45 20, 50 15, 60 15 M45 40 C 40 40, 30 35, 30 30 C 30 25, 35 20, 40 20 M45 40 L 45 80 M45 80 C 40 80, 30 85, 25 90 M45 80 C 50 80, 60 85, 65 90 M45 80 C 43 85, 47 85, 45 90 M45 80 C 40 85, 50 85, 45 95"
              stroke="#8B4513"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />

            <circle cx="60" cy="15" r="5" fill="#228B22" />
            <circle cx="70" cy="25" r="6" fill="#228B22" />
            <circle cx="55" cy="25" r="4" fill="#32CD32" />
            <circle cx="40" cy="20" r="5" fill="#32CD32" />
            <circle cx="28" cy="30" r="6" fill="#228B22" />
            <circle cx="35" cy="35" r="4" fill="#32CD32" />
            <circle cx="65" cy="35" r="5" fill="#228B22" />
            <path
              d="M35 45 Q 33 50 30 52 M 35 50 Q 32 55 28 57 M 65 45 Q 67 50 70 52 M 65 50 Q 68 55 72 57"
              stroke="#8B4513"
              strokeWidth="0.5"
              fill="none"
              strokeLinecap="round"
            />
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
          <div className="text-[0.5rem] leading-tight tracking-widest mb-4 font-headline text-foreground/70">
            <p>॥ विजयते श्रीबालकृष्णः प्रभुः ॥</p>
            <p>॥ श्रीवल्लभविट्ठलेशौ विजयेते ॥</p>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold font-headline mb-2">
            Namo Vṛkṣebhyaḥ
          </h1>
          <p className="text-4xl md:text-6xl font-headline text-primary/90">
            Vṛkṣāropaṇa Mahotsava
          </p>
          <div className="my-10 flex flex-col items-center justify-center relative">
            <Logo />
          </div>
          <div className="flex flex-col items-center space-y-4">
            <Link
              href="#"
              className="inline-block px-10 py-4 text-lg font-semibold rounded-full text-secondary-foreground bg-gradient-to-br from-white to-secondary shadow-lg border border-white/50 transform transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-ring"
            >
              View E-brochure
            </Link>
            <Link
              href="#"
              className="inline-block px-10 py-4 text-lg font-semibold rounded-full text-secondary-foreground bg-gradient-to-br from-white to-secondary shadow-lg border border-white/50 transform transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-ring"
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
