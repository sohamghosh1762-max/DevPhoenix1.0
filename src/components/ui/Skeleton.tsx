"use client";

import { designSystem } from "@/lib/design-system";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-slate-200/80 rounded-md ${className}`} />
  );
}

export function CardSkeleton() {
  const roundedClass = designSystem.borderRadius.card;
  return (
    <div className={`bg-white border border-slate-100 p-6 md:p-8 flex flex-col h-full animate-pulse ${roundedClass}`}>
      <Skeleton className="h-44 w-full rounded-2xl mb-6" />
      <Skeleton className="h-6 w-3/4 mb-3" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6 mb-6" />
      <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-100">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl animate-pulse">
      <Skeleton className="h-8 w-12 bg-slate-800 mb-2" />
      <Skeleton className="h-4 w-24 bg-slate-800" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="w-full space-y-4 p-4 animate-pulse">
      <div className="flex gap-4 pb-3 border-b border-slate-800">
        <Skeleton className="h-4 w-1/4 bg-slate-800" />
        <Skeleton className="h-4 w-1/4 bg-slate-800" />
        <Skeleton className="h-4 w-1/6 bg-slate-800" />
        <Skeleton className="h-4 w-1/6 bg-slate-800" />
      </div>
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="flex gap-4 py-2 border-b border-slate-800/40">
          <Skeleton className="h-10 w-1/4 bg-slate-800/80" />
          <Skeleton className="h-8 w-1/4 bg-slate-800/80" />
          <Skeleton className="h-6 w-1/6 bg-slate-800/80" />
          <Skeleton className="h-6 w-1/6 bg-slate-800/80" />
        </div>
      ))}
    </div>
  );
}
