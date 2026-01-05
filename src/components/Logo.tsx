import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ className, disableLink = false }: { className?: string, disableLink?: boolean }) {
  const logoContent = (
    <div className={cn('flex items-center gap-2 mr-6', className)}>
      <Image src="https://iili.io/fjejDI1.png" alt="MuscleUp Logo" width={40} height={10} />
    </div>
  );

  if (disableLink) {
    return logoContent;
  }

  return (
    <Link href="/">
      {logoContent}
    </Link>
  );
}
