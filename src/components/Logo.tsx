import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ className, disableLink = false }: { className?: string, disableLink?: boolean }) {
  const image = (
      <Image src="https://iili.io/fjejDI1.png" alt="MuscleUp Logo" width={40} height={10} />
  );

  if (disableLink) {
    return (
        <div className={cn('flex items-center gap-2 mr-6', className)}>
            {image}
        </div>
    );
  }

  return (
    <Link href="/" className={cn('flex items-center gap-2 mr-6', className)}>
      {image}
    </Link>
  );
}
