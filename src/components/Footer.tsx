'use client';

import { useEffect, useState } from 'react';
import { Logo } from '@/components/Logo';
import { Instagram, Twitter } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t border-border/40">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Logo />
          {currentYear && (
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              © {currentYear} MuscleUp. All rights reserved.
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
            <Link href="https://twitter.com" target="_blank" rel="noreferrer" className="text-muted-foreground transition-colors hover:text-foreground">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
            </Link>
            <Link href="https://instagram.com" target="_blank" rel="noreferrer" className="text-muted-foreground transition-colors hover:text-foreground">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
            </Link>
        </div>
      </div>
    </footer>
  );
}
