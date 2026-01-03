import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn('flex items-center gap-2', className)}>
      <Image src="https://iili.io/fjejDI1.png" alt="MuscleUp Logo" width={80} height={20} />
    </Link>
  );
}
