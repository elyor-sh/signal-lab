import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type BadgeTone = 'success' | 'warning' | 'danger' | 'neutral';

const toneClass: Record<BadgeTone, string> = {
  success: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  warning: 'bg-amber-100 text-amber-800 border-amber-200',
  danger: 'bg-red-100 text-red-800 border-red-200',
  neutral: 'bg-slate-100 text-slate-800 border-slate-200',
};

export function Badge({ className, tone = 'neutral', ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        'inline-flex min-h-6 items-center rounded-md border px-2 py-0.5 text-xs font-semibold',
        toneClass[tone],
        className,
      )}
      {...props}
    />
  );
}
