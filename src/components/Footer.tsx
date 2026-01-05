'use client';

import { useEffect, useState } from 'react';
import { Logo } from '@/components/Logo';
import { Instagram, Twitter, QrCode } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import placeholderImagesData from '@/lib/placeholder-images.json';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { QRCode } from 'react-qrcode-logo';

export function Footer() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [siteUrl, setSiteUrl] = useState('');
  const [isClient, setIsClient] = useState(false);
  const footerImage = placeholderImagesData.placeholderImages.find(p => p.id === 'footer-cta');

  useEffect(() => {
    // This effect runs only on the client, after hydration
    setIsClient(true);
    setCurrentYear(new Date().getFullYear());
    setSiteUrl(window.location.origin);
  }, []);

  return (
    <footer className="border-t border-border/40">
      <section className="relative w-full py-20 md:py-28 flex items-center justify-center text-center text-white overflow-hidden">
        {footerImage && (
          <Image
            src={footerImage.imageUrl}
            alt={footerImage.description}
            fill
            className="object-cover"
            data-ai-hint={footerImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/75" />
        <div className="relative z-10 container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold font-headline tracking-tighter mb-4 [text-shadow:0_2px_8px_rgba(0,0,0,0.8)]">
            Join The Movement
          </h2>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 [text-shadow:0_1px_4px_rgba(0,0,0,0.7)]">
            Follow our journey and stay motivated with our community.
          </p>
          <div className="flex items-center justify-center gap-6">
              <Button asChild variant="outline" size="icon" className="bg-transparent text-white border-white hover:bg-white hover:text-black rounded-full h-12 w-12">
                <Link href="https://twitter.com" target="_blank" rel="noreferrer">
                    <Twitter className="h-6 w-6" />
                    <span className="sr-only">Twitter</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="icon" className="bg-transparent text-white border-white hover:bg-white hover:text-black rounded-full h-12 w-12">
                <Link href="https://www.instagram.com/muscleuppfitness?igsh=MXJ2NjVoaTNlZjJpOA==" target="_blank" rel="noreferrer">
                    <Instagram className="h-6 w-6" />
                    <span className="sr-only">Instagram</span>
                </Link>
              </Button>
               <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="icon" className="bg-transparent text-white border-white hover:bg-white hover:text-black rounded-full h-12 w-12">
                        <QrCode className="h-6 w-6" />
                        <span className="sr-only">Show QR Code</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4 bg-white">
                  {isClient && siteUrl ? (
                    <div className="text-center">
                        <p className="text-sm font-medium text-black mb-2">Scan to visit!</p>
                        <QRCode value={siteUrl} size={128} bgColor={"#ffffff"} fgColor={"#000000"} level={"L"} />
                    </div>
                  ) : (
                    <div className="h-[150px] w-[128px] bg-gray-200 animate-pulse rounded-md" />
                  )}
                </PopoverContent>
              </Popover>
          </div>
        </div>
      </section>
      <div className="bg-background">
        <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-20 md:flex-row md:py-0">
            <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <Logo />
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              {isClient && currentYear && `© ${currentYear} MuscleUp. All rights reserved.`}
            </p>
            </div>
        </div>
      </div>
    </footer>
  );
}
