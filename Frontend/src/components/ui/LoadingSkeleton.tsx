export function LoadingSkeleton({ className = "h-4 w-full rounded-md bg-slate-200" }: { className?: string }) {
  return <div className={`animate-pulse ${className}`} />;
}
