import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { BackButtonProps } from '@/types';

export default function BackButton({ href = '/', label = 'New Search' }: BackButtonProps) {
  return (
    <Link href={href} className="btn-back">
      <ArrowLeft className="w-4 h-4" />
      <span>{label}</span>
    </Link>
  );
}
