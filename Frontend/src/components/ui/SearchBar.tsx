import type { InputHTMLAttributes } from "react";
import { Input } from "@/components/ui/Input";

export function SearchBar(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <Input className="pl-10" {...props} />
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
    </div>
  );
}
